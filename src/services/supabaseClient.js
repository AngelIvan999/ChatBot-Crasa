import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Servicio para obtener todos los usuarios con su último mensaje
export const getUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("last_seen_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Servicio para obtener el historial de chat de un usuario
export const getChatHistory = async (userId) => {
  const { data, error } = await supabase
    .from("chat_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

// Servicio para obtener información de un usuario específico
export const getUser = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

// Suscripción en tiempo real para nuevos mensajes
export const subscribeToMessages = (userId, callback) => {
  return supabase
    .channel(`chat:${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "chat_history",
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

// Suscripción para cambios en usuarios (nuevo último mensaje)
export const subscribeToUsers = (callback) => {
  return supabase
    .channel("users")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "users",
      },
      callback
    )
    .subscribe();
};
