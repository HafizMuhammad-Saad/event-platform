import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with your project URL and public anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or Key is not defined in environment variables');
}
export const supabase = createClient(supabaseUrl, supabaseKey);