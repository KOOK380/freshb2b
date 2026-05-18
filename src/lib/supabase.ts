import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gfmvcypouoqvfbclxmae.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_l-meqaAb51zPWWA6yay0SQ_tMOaddw6';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
