import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.DATABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
