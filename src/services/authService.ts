import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email?: string;
  nama: string;
  peranan: 'guru' | 'ibubapa' | 'admin';
  nama_sekolah?: string;
  no_telefon?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserProfile | null;
  session?: any;
}

/**
 * 1. DAFTAR AKAUN BAHARU (Emel & Kata Laluan SAHAJA)
 * Sesuai untuk Guru atau Ibu Bapa
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
  if (!isSupabaseConfigured) {
    return {
      success: false,
      message: 'Pangkalan data Supabase belum dikonfigurasikan.',
    };
  }

  const cleanEmail = params.email.trim().toLowerCase();

  try {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: params.password,
      options: {
        data: {
          nama: params.nama.trim(),
          peranan: params.peranan,
          nama_sekolah: params.nama_sekolah?.trim() || '',
          nama_kelas: params.nama_kelas?.trim() || '',
          no_telefon: params.no_telefon?.trim() || '',
        },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    if (!data.user) {
      return { success: false, message: 'Pendaftaran gagal dibuat.' };
    }

    // Cipta / Kemas kini rekod dalam jadual public.profiles secara langsung
    const userProfile: UserProfile = {
      id: data.user.id,
      email: cleanEmail,
      nama: params.nama.trim(),
      peranan: params.peranan,
      nama_sekolah: params.nama_sekolah?.trim() || '',
      no_telefon: params.no_telefon?.trim() || '',
    };

    await supabase.from('profiles').upsert({
      id: data.user.id,
      nama: userProfile.nama,
      peranan: userProfile.peranan,
      nama_sekolah: userProfile.nama_sekolah,
      no_telefon: userProfile.no_telefon,
    });

    return {
      success: true,
      message: data.session
        ? 'Pendaftaran berjaya! Anda telah log masuk secara automatik.'
        : 'Pendaftaran berjaya! Sila semak peti emel anda untuk pengesahan.',
      user: userProfile,
      session: data.session,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Ralat semasa pendaftaran pengguna.',
    };
  }
}

/**
 * 2. LOG MASUK (Emel & Kata Laluan SAHAJA)
 */
export async function loginWithEmail(email: string, password: string): Promise<AuthResponse> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      message: 'Pangkalan data Supabase belum dikonfigurasikan.',
    };
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (error) {
      return {
        success: false,
        message:
          error.message === 'Invalid login credentials'
            ? 'Emel atau kata laluan tidak tepat. Sila cuba lagi.'
            : error.message,
      };
    }

    if (!data.user) {
      return { success: false, message: 'Pengguna tidak dijumpai.' };
    }

    // Ambil maklumat profil dari jadual public.profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const userProfile: UserProfile = {
      id: data.user.id,
      email: cleanEmail,
      nama: profile?.nama || data.user.user_metadata?.nama || 'Pengguna',
      peranan: (profile?.peranan || data.user.user_metadata?.peranan || 'guru') as any,
      nama_sekolah: profile?.nama_sekolah || data.user.user_metadata?.nama_sekolah,
      no_telefon: profile?.no_telefon || data.user.user_metadata?.no_telefon,
      avatar_url: profile?.avatar_url,
    };

    return {
      success: true,
      message: 'Log masuk berjaya!',
      user: userProfile,
      session: data.session,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Ralat berlaku semasa log masuk.',
    };
  }
}

/**
 * 3. LOG KELUAR
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) return { success: true, message: 'Log keluar berjaya.' };

  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Log keluar berjaya.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Ralat log keluar.' };
  }
}

/**
 * 4. DAPATKAN PENGGUNA YANG SEDANG LOG MASUK
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email,
      nama: profile?.nama || user.user_metadata?.nama || 'Pengguna',
      peranan: (profile?.peranan || user.user_metadata?.peranan || 'guru') as any,
      nama_sekolah: profile?.nama_sekolah || user.user_metadata?.nama_sekolah,
      no_telefon: profile?.no_telefon || user.user_metadata?.no_telefon,
      avatar_url: profile?.avatar_url,
    };
  } catch (err) {
    return null;
  }
}

/**
 * 5. LUPA KATA LALUAN (Reset Password via Emel)
 */
export async function sendPasswordResetEmail(email: string): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, message: 'Pangkalan data belum dikonfigurasikan.' };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) return { success: false, message: error.message };
    return {
      success: true,
      message: 'Pautan tetapan semula kata laluan telah dihantar ke emel anda.',
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Ralat menghantar pautan tetapan semula.' };
  }
}
