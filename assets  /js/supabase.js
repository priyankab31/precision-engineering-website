// Replace both values with your Supabase Project URL and publishable/anon key.
// These browser values are public by design; database security must be enforced with RLS.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY";
export const supabaseConfigured = !SUPABASE_URL.includes("YOUR_PROJECT_ID") && !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
