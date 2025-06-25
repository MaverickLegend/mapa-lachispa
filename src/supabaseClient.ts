import { createClient } from "@supabase/supabase-js";

// Obtener las credenciales de Supabase desde las variables de entorno de Vite
const supabaseUrl = "https://lbyitwzfpayvfiuygrsf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxieWl0d3pmcGF5dmZpdXlncnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNDU3NjYsImV4cCI6MjA2NTYyMTc2Nn0.6n5AUyMpbXHs4h3bFPdW-VSRV_XhBBut_mRBM_Q5g7U";

// Validar que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY deben estar definidas en el archivo .env");
}

// Crear y exportar el cliente de Supabase para usar en toda la aplicación
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
