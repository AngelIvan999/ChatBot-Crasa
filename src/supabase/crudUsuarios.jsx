import Swal from "sweetalert2";
import { supabase } from "../supabase/supabase.config";

const tabla = "users";

export async function ObtenerIdAuthSupabase() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session != null) {
    const { user } = session;
    const idauth = user.id;
    return idauth;
  }
}

export async function MostrarUsuarios(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_auth", p.id_auth)
    .maybeSingle();
  return data;
}
