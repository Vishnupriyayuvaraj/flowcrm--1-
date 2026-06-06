import { createClient } from '@supabase/supabase-js';

// We add fallback placeholder values (the || part) so the app doesn't crash 
// if the .env variables aren't loaded correctly yet!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);