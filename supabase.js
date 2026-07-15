const SUPABASE_URL = "https://qsnxjjoevzfwlkhmaqga.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzbnhqam9ldnpmd2xraG1hcWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MzAzMDMsImV4cCI6MjA5OTEwNjMwM30.0Nt1EAmLLPRd2FMQ6EXzaJB_edY37qdkGA3L8axCh-g";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("✅ Supabase conectado");