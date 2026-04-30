import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kjlpokvfhqsxtetujkre.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqbHBva3ZmaHFzeHRldHVqa3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNzgzOTUsImV4cCI6MjA5MDk1NDM5NX0.aBXYNnd1MDJS6WWVeS0gjxRHJ06gypiQXwRco6f51uE";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);