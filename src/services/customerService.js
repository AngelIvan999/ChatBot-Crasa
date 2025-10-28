import { supabase } from "./supabaseClient";

// Obtener todos los clientes
export const getCustomers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Crear un nuevo cliente
export const createCustomer = async (customerData) => {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        name: customerData.name,
        phone: customerData.phone,
        metadata: customerData.metadata,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Actualizar un cliente
export const updateCustomer = async (id, customerData) => {
  const { data, error } = await supabase
    .from("users")
    .update({
      name: customerData.name,
      phone: customerData.phone,
      metadata: customerData.metadata,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Eliminar un cliente
export const deleteCustomer = async (id) => {
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) throw error;
};

// Suscripción a cambios en tiempo real
export const subscribeToCustomers = (callback) => {
  return supabase
    .channel("customers")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "users",
      },
      callback
    )
    .subscribe();
};
