import { supabase } from "../supabase/supabase.config";

// Obtener todo el stock con información de producto y sabor
export const getStock = async () => {
  const { data, error } = await supabase
    .from("stock")
    .select(
      `
      *,
      products (
        id,
        nombre_product,
        prc_menudeo,
        cant_paquete
      ),
      sabores (
        id,
        nombre
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

// Obtener stock de un producto específico
export const getStockByProduct = async (productId) => {
  const { data, error } = await supabase
    .from("stock")
    .select(
      `
      *,
      sabores (
        id,
        nombre
      )
    `
    )
    .eq("product_id", productId);

  if (error) throw error;
  return data;
};

// Crear entrada de stock
export const createStock = async (stockData) => {
  const { data, error } = await supabase
    .from("stock")
    .insert([
      {
        product_id: stockData.product_id,
        sabor_id: stockData.sabor_id,
        cantidad_disponible: stockData.cantidad_disponible,
        cantidad_minima: stockData.cantidad_minima || 10,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Actualizar cantidad de stock
export const updateStock = async (id, cantidad) => {
  const { data, error } = await supabase
    .from("stock")
    .update({
      cantidad_disponible: cantidad,
      ultima_actualizacion: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Actualizar cantidad mínima
export const updateStockMinimo = async (id, cantidadMinima) => {
  const { data, error } = await supabase
    .from("stock")
    .update({
      cantidad_minima: cantidadMinima,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Eliminar entrada de stock
export const deleteStock = async (id) => {
  const { error } = await supabase.from("stock").delete().eq("id", id);
  if (error) throw error;
};

// Obtener resumen de stock (productos con stock bajo)
export const getStockBajo = async () => {
  const { data, error } = await supabase.from("stock").select(`
      *,
      products (
        nombre_product
      ),
      sabores (
        nombre
      )
    `);

  if (error) throw error;

  // Filtrar manualmente los productos con stock bajo
  return data.filter(
    (item) => item.cantidad_disponible <= item.cantidad_minima
  );
};

// Verificar disponibilidad para surtir pedidos pendientes
export const verificarDisponibilidad = async () => {
  // Obtener pedidos incompletos con información completa
  const { data: salesPending, error: salesError } = await supabase
    .from("sales")
    .select(
      `
      id,
      status,
      process,
      created_at,
      users:user_id (
        name,
        phone
      ),
      sale_items (
        product_id,
        sabor_id,
        quantity,
        products:product_id (
          nombre_product
        ),
        sabores:sabor_id (
          nombre
        )
      )
    `
    )
    .eq("process", "incomplete")
    .order("created_at", { ascending: false });

  if (salesError) throw salesError;

  // Obtener stock actual
  const { data: stockData, error: stockError } = await supabase
    .from("stock")
    .select("*");

  if (stockError) throw stockError;

  // Analizar cada pedido
  const faltantes = [];

  salesPending.forEach((sale) => {
    let totalFaltante = 0;
    let tieneFaltantes = false;

    sale.sale_items.forEach((item) => {
      const stockItem = stockData.find(
        (s) => s.product_id === item.product_id && s.sabor_id === item.sabor_id
      );

      const disponible = stockItem?.cantidad_disponible || 0;

      if (disponible < item.quantity) {
        tieneFaltantes = true;
        totalFaltante += item.quantity - disponible;
      }
    });

    if (tieneFaltantes) {
      faltantes.push({
        ticket_id: sale.id,
        cliente: sale.users?.name || "-",
        telefono: sale.users?.phone || "N/A",
        status: sale.status,
        total_items: sale.sale_items.length,
        total_faltante: totalFaltante,
      });
    }
  });

  return faltantes;
};

// Suscripción a cambios en tiempo real
export const subscribeToStock = (callback) => {
  return supabase
    .channel("stock")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "stock",
      },
      callback
    )
    .subscribe();
};
