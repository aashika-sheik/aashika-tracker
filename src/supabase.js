import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://iniemintxzroowzictum.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluaWVtaW50eHpyb293emljdHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4Nzk1MjUsImV4cCI6MjA5MzQ1NTUyNX0.ycBWKv9Ko9TKC8eyhkQlOCQUvI6PmNv-g1CejPWdggk";

export const supabase = createClient(supabaseUrl, supabaseKey);