import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zjlutuncfgciiubrkcfe.supabase.co';
const supabaseKey = 'sb_publishable_k-9JpTT_6iFV1-DEv-vxwg_-RHebGDr';
export const supabase = createClient(supabaseUrl, supabaseKey); 