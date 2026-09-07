import { createClient } from '@supabase/supabase-js';

// Ambil kunci API dari fail persekitaran (.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key'
);

if (!isSupabaseConfigured) {
  console.warn(
    '⚠️ [Supabase] VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum dikonfigurasikan dalam fail .env. Mod sandaran tempatan (localStorage) akan digunakan.'
  );
}

// Inisialisasi Supabase Client dengan konfigurasi selamat
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

export default supabase;
