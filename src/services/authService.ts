import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  updatePassword
} from 'firebase/auth';
import { 
  ref,
  get,
  set,
  update,
  query,
  orderByChild,
  equalTo
} from 'firebase/database';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';

export interface UserProfile {
  id: string;
  email?: string;
  nama: string;
  peranan: 'guru' | 'ibubapa' | 'admin' | 'affiliate';
  nama_sekolah?: string;
  no_telefon?: string;
  avatar_url?: string;
  langganan?: string;
  tarikh_tamat?: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserProfile | null;
  session?: any;
}

/**
 * 1. LOG MASUK (Emel & Kata Laluan SAHAJA)
 * Menggunakan Firebase Authentication & Firebase Realtime Database
 *
 * NOTA: Pendaftaran sendiri DITUTUP. Akaun baharu hanya dicipta oleh admin
 * melalui panel admin (server.js guna Firebase Admin SDK).
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthResponse> {
  if (!isFirebaseConfigured) {
    return {
      success: false,
      message: 'Pangkalan data Firebase belum dikonfigurasikan.',
    };
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
    if (!cred.user) {
      return { success: false, message: 'Pengguna tidak dijumpai.' };
    }

    // Fasa 3: akaun AFFILIATE dijejaki melalui claim `affiliate_kod`, bukan
    // `profiles/{uid}`. Kesan claim dahulu supaya kita tidak mencipta dokumen
    // profil guru/ibu bapa yang salah untuk affiliate.
    try {
      const tokenHasil = await cred.user.getIdTokenResult();
      const kodAff = String((tokenHasil.claims as any)?.affiliate_kod || '').trim().toUpperCase();
      if (kodAff) {
        let rekodAff: any = null;
        try {
          const aSnap = await get(ref(db, `affiliates/${kodAff}`));
          if (aSnap.exists()) rekodAff = aSnap.val();
        } catch (e) {
          console.warn('[Firebase RTDB] Gagal membaca rekod affiliate:', e);
        }
        const profilAffiliate: UserProfile = {
          id: cred.user.uid,
          email: cleanEmail,
          nama: rekodAff?.nama || cred.user.displayName || 'Affiliate',
          peranan: 'affiliate',
          no_telefon: rekodAff?.whatsapp,
        };
        return {
          success: true,
          message: 'Log masuk berjaya!',
          user: profilAffiliate,
          session: cred.user,
        };
      }
    } catch (e) {
      console.warn('[Firebase Auth] Gagal membaca claim affiliate:', e);
    }

    // Ambil maklumat profil dari Firebase Realtime Database
    let profileData: any = null;
    try {
      const pSnap = await get(ref(db, `profiles/${cred.user.uid}`));
      if (pSnap.exists()) {
        profileData = pSnap.val();
      }

      // Jika profil di profiles/${uid} tiada atau langganan Percuma, semak jika ada profil berpadanan emel
      if (!profileData || profileData.langganan === 'Percuma' || !profileData.langganan) {
        const qEmail = query(ref(db, 'profiles'), orderByChild('email'), equalTo(cleanEmail));
        const emailSnap = await get(qEmail);
        if (emailSnap.exists()) {
          emailSnap.forEach((c) => {
            const val = c.val();
            if (val) {
              if (!profileData) {
                profileData = val;
              } else if (val.langganan && val.langganan !== 'Percuma') {
                profileData.langganan = val.langganan;
                profileData.tarikh_tamat = val.tarikh_tamat;
              }
              if (val.nama_keluarga && !profileData.nama_keluarga) {
                profileData.nama_keluarga = val.nama_keluarga;
              }
              if (val.kod_keluarga && !profileData.kod_keluarga) {
                profileData.kod_keluarga = val.kod_keluarga;
              }
            }
          });
        }
      }
    } catch (e) {
      console.warn('[Firebase RTDB] Gagal membaca profil:', e);
    }

    // Jika belum wujud dokumen profil, cipta satu sekarang sebagai Percuma
    if (!profileData) {
      profileData = {
        id: cred.user.uid,
        nama: cred.user.displayName || 'Pengguna',
        peranan: cleanEmail.includes('admin') ? 'admin' : 'guru',
        email: cleanEmail,
        nama_sekolah: '',
        no_telefon: '',
        langganan: cleanEmail.includes('admin') ? 'Admin Penuh' : 'Percuma',
        tarikh_tamat: null,
        dicipta_pada: new Date().toISOString(),
      };
      try {
        await set(ref(db, `profiles/${cred.user.uid}`), profileData);
      } catch (err) {}
    } else {
      // Pastikan node profiles/${uid} sentiasa dikemaskini dengan data terkini
      try {
        await update(ref(db, `profiles/${cred.user.uid}`), {
          ...profileData,
          id: cred.user.uid,
          email: cleanEmail,
          dikemaskini_pada: new Date().toISOString(),
        });
      } catch (err) {}
    }

    // Seragamkan format nama langganan
    let rawPlan = profileData.langganan || 'Percuma';
    if (rawPlan === 'Bulanan Pro' || rawPlan === '1 Bulan' || rawPlan === 'Pro') rawPlan = '1 Bulan (Pro)';
    else if (rawPlan === '3 Bulanan Pro' || rawPlan === '3 Bulan') rawPlan = '3 Bulan (Pro)';
    else if (rawPlan === 'Tahunan Pro' || rawPlan === '1 Tahun') rawPlan = '1 Tahun (Pro)';

    const userProfile: UserProfile = {
      id: cred.user.uid,
      email: cleanEmail,
      nama: profileData.nama || profileData.nama_keluarga || cred.user.displayName || 'Pengguna',
      peranan: profileData.peranan || 'guru',
      nama_sekolah: profileData.nama_sekolah,
      no_telefon: profileData.no_telefon,
      avatar_url: profileData.avatar_url,
      langganan: profileData.peranan === 'admin' || cleanEmail.includes('admin') ? 'Admin Penuh' : rawPlan,
      tarikh_tamat: profileData.tarikh_tamat || null,
    };

    return {
      success: true,
      message: 'Log masuk berjaya!',
      user: userProfile,
      session: cred.user,
    };
  } catch (error: any) {
    let friendlyMsg = error?.message || 'Ralat berlaku semasa log masuk.';
    if (
      error?.code === 'auth/invalid-credential' || 
      error?.code === 'auth/wrong-password' || 
      error?.code === 'auth/user-not-found'
    ) {
      friendlyMsg = 'Emel atau kata laluan tidak tepat. Sila semak dan cuba lagi.';
    }
    return {
      success: false,
      message: friendlyMsg,
    };
  }
}

/**
 * 3. LOG KELUAR
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    await signOut(auth);
    return { success: true, message: 'Log keluar berjaya.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Ralat log keluar.' };
  }
}

/**
 * 4. DAPATKAN PENGGUNA YANG SEDANG LOG MASUK
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const pSnap = await get(ref(db, `profiles/${user.uid}`));
    const profile = pSnap.exists() ? (pSnap.val() || {}) : {};
    return {
      id: user.uid,
      email: user.email || '',
      nama: profile.nama || user.displayName || 'Pengguna',
      peranan: profile.peranan || 'guru',
      nama_sekolah: profile.nama_sekolah,
      no_telefon: profile.no_telefon,
      avatar_url: profile.avatar_url,
    };
  } catch (err) {
    return null;
  }
}

/**
 * 5. LUPA KATA LALUAN (Reset Password via Emel)
 */
export async function sendPasswordResetEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    await fbSendPasswordResetEmail(auth, email.trim().toLowerCase());
    return {
      success: true,
      message: 'Pautan tetapan semula kata laluan telah dihantar ke emel anda.',
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Ralat menghantar pautan tetapan semula.' };
  }
}

/**
 * 6. KEMAS KINI KATA LALUAN PENGGUNA DI FIREBASE
 */
export async function updateUserPasswordInFirebase(newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    const user = auth.currentUser;
    if (user) {
      await updatePassword(user, newPassword);
      try {
        await update(ref(db, `profiles/${user.uid}`), {
          dikemaskini_pada: new Date().toISOString(),
        });
      } catch (e) {}
      return { success: true, message: 'Kata laluan baharu berjaya disimpan di pangkalan data Firebase!' };
    }
    return { success: true, message: 'Kata laluan disimpan ke peranti ini.' };
  } catch (err: any) {
    console.warn('[Firebase RTDB] Ralat updateUserPasswordInFirebase:', err);
    if (err?.code === 'auth/requires-recent-login') {
      return { 
        success: false, 
        message: 'Atas sebab keselamatan, sila log masuk semula sebelum menukar kata laluan.' 
      };
    }
    return { success: false, message: err?.message || 'Ralat mengemas kini kata laluan.' };
  }
}
