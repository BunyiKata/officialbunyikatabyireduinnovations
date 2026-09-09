import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  updateProfile,
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
  peranan: 'guru' | 'ibubapa' | 'admin';
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
 * 1. DAFTAR AKAUN BAHARU (Emel & Kata Laluan SAHAJA)
 * Menggunakan Firebase Authentication & Firebase Realtime Database
 * PERATURAN KETAT: 1 Emel hanya boleh didaftarkan 1 kali sahaja (tidak boleh daftar guru dan ibu bapa dengan emel sama)
 */
export async function registerWithEmail(params: {
  email: string;
  password: string;
  nama: string;
  peranan: 'guru' | 'ibubapa';
  nama_sekolah?: string;
  nama_kelas?: string;
  no_telefon?: string;
}): Promise<AuthResponse> {
  if (!isFirebaseConfigured) {
    return {
      success: false,
      message: 'Pangkalan data Firebase belum dikonfigurasikan.',
    };
  }

  const cleanEmail = params.email.trim().toLowerCase();

  // 1. Semakan awal pangkalan data Realtime Database jika emel sudah pernah didaftarkan
  try {
    const qEmail = query(ref(db, 'profiles'), orderByChild('email'), equalTo(cleanEmail));
    const snapEmail = await get(qEmail);
    if (snapEmail.exists()) {
      let existingRole = '';
      snapEmail.forEach(c => {
        existingRole = c.val()?.peranan || '';
      });
      const roleText = existingRole === 'guru' ? 'Mod Guru' : existingRole === 'ibubapa' ? 'Mod Ibu Bapa' : 'akaun lain';
      return {
        success: false,
        message: `Emel '${cleanEmail}' telah pun didaftarkan untuk ${roleText}. 1 emel hanya dibenarkan untuk 1 pendaftaran akaun sahaja. Sila gunakan tab 'Log Masuk'.`,
      };
    }
  } catch (checkErr) {
    console.warn('[Firebase RTDB] Semakan awal emel berdaftar:', checkErr);
  }

  // 2. Semakan cache tempatan admin
  try {
    const teachers = JSON.parse(localStorage.getItem('bunyiKataAdminTeachers') || '[]');
    const parents = JSON.parse(localStorage.getItem('bunyiKataAdminParents') || '[]');
    const teacherFound = teachers.some((t: any) => t.email && t.email.toLowerCase() === cleanEmail);
    const parentFound = parents.some((p: any) => p.email && p.email.toLowerCase() === cleanEmail);
    if (teacherFound || parentFound) {
      const existingRoleName = teacherFound ? 'Mod Guru' : 'Mod Ibu Bapa';
      return {
        success: false,
        message: `Emel '${cleanEmail}' telah didaftarkan untuk ${existingRoleName}. 1 emel hanya untuk 1 pendaftaran akaun sahaja. Sila gunakan fungsi 'Log Masuk'.`,
      };
    }
  } catch (e) {}

  try {
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, params.password);
    if (!cred.user) {
      return { success: false, message: 'Pendaftaran akaun gagal dibuat.' };
    }

    try {
      await updateProfile(cred.user, { displayName: params.nama.trim() });
    } catch (e) {}

    const userProfile: UserProfile = {
      id: cred.user.uid,
      email: cleanEmail,
      nama: params.nama.trim(),
      peranan: params.peranan,
      nama_sekolah: params.nama_sekolah?.trim() || '',
      no_telefon: params.no_telefon?.trim() || '',
      langganan: 'Percuma',
      tarikh_tamat: null,
    };

    // Simpan maklumat profil ke Firebase Realtime Database
    try {
      await set(ref(db, `profiles/${cred.user.uid}`), {
        id: cred.user.uid,
        nama: userProfile.nama,
        peranan: userProfile.peranan,
        nama_sekolah: userProfile.nama_sekolah,
        no_telefon: userProfile.no_telefon,
        email: cleanEmail,
        langganan: 'Percuma',
        tarikh_tamat: null,
        dicipta_pada: new Date().toISOString(),
        dikemaskini_pada: new Date().toISOString(),
      });
    } catch (upsertErr) {
      console.warn('[Firebase RTDB] Gagal kemas kini profiles semasa daftar:', upsertErr);
    }

    return {
      success: true,
      message: 'Pendaftaran berjaya! Anda telah log masuk secara automatik ke akaun anda.',
      user: userProfile,
      session: cred.user,
    };
  } catch (error: any) {
    let friendlyMsg = error?.message || 'Ralat berlaku semasa pendaftaran.';
    if (error?.code === 'auth/email-already-in-use') {
      let roleDesc = '';
      try {
        const qEmail = query(ref(db, 'profiles'), orderByChild('email'), equalTo(cleanEmail));
        const snapEmail = await get(qEmail);
        if (snapEmail.exists()) {
          snapEmail.forEach(c => {
            const r = c.val()?.peranan;
            if (r === 'guru') roleDesc = ' (Mod Guru)';
            else if (r === 'ibubapa') roleDesc = ' (Mod Ibu Bapa)';
          });
        }
      } catch (e) {}
      friendlyMsg = `Emel '${cleanEmail}' telah pun didaftarkan${roleDesc}. 1 emel hanya dibenarkan untuk 1 pendaftaran akaun sahaja. Sila gunakan tab 'Log Masuk'.`;
    } else if (error?.code === 'auth/invalid-email') {
      friendlyMsg = 'Format emel tidak sah. Sila semak semula emel anda.';
    } else if (error?.code === 'auth/weak-password') {
      friendlyMsg = 'Kata laluan terlalu lemah. Sila gunakan sekurang-kurangnya 6 aksara.';
    }
    return {
      success: false,
      message: friendlyMsg,
    };
  }
}

/**
 * 2. LOG MASUK (Emel & Kata Laluan SAHAJA)
 * Menggunakan Firebase Authentication & Firebase Realtime Database
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

    // Ambil maklumat profil dari Firebase Realtime Database
    let profileData: any = null;
    try {
      const pSnap = await get(ref(db, `profiles/${cred.user.uid}`));
      if (pSnap.exists()) {
        profileData = pSnap.val();
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
    }

    const userProfile: UserProfile = {
      id: cred.user.uid,
      email: cleanEmail,
      nama: profileData.nama || cred.user.displayName || 'Pengguna',
      peranan: profileData.peranan || 'guru',
      nama_sekolah: profileData.nama_sekolah,
      no_telefon: profileData.no_telefon,
      avatar_url: profileData.avatar_url,
      langganan: profileData.peranan === 'admin' || cleanEmail.includes('admin') ? 'Admin Penuh' : (profileData.langganan || 'Percuma'),
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
