import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ifcqutgeihcplhpvdimf.supabase.co";
const supabaseKey = "sb_publishable_5Y01UboKTIR5Nj0_zJWoRQ_6Nn4U6Bu";

export const supabase = createClient(supabaseUrl, supabaseKey);