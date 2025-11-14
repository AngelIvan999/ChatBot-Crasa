import { supabase } from "../supabase/supabase.config";

// Obtener todos los productos con sus entradas y stock total
export const getAlmacenCompleto = async () => {
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(
      `
      *,
      producto_sabores (
        sabor_id,
        sabores (
          id,
          nombre
        )
      )
    `
    )
    .order("created_at", { ascending: false });

  if (productsError) throw productsError;

  // Para cada producto, obtener entradas y stock
  const almacenData = await Promise.all(
    products.map(async (product) => {
      // Contar entradas por sabor
      const { data: entries } = await supabase
        .from("stock_entries")
        .select("sabor_id, cantidad")
        .eq("product_id", product.id);

      // Obtener stock actual por sabor
      const { data: stock } = await supabase
        .from("stock")
        .select("sabor_id, cantidad_disponible")
        .eq("product_id", product.id);

      // Agrupar por sabor
      const saboresData = {};

      product.producto_sabores.forEach((ps) => {
        const saborId = ps.sabor_id;
        const saborNombre = ps.sabores.nombre;

        const entradasCount =
          entries?.filter((e) => e.sabor_id === saborId).length || 0;
        const stockTotal =
          stock?.find((s) => s.sabor_id === saborId)?.cantidad_disponible || 0;

        saboresData[saborId] = {
          nombre: saborNombre,
          entradas: entradasCount,
          stock: stockTotal,
        };
      });

      return {
        ...product,
        saboresData,
      };
    })
  );

  return almacenData;
};

// Registrar nueva entrada de stock
export const registrarEntrada = async (entryData) => {
  // Insertar en stock_entries
  const { data: entry, error: entryError } = await supabase
    .from("stock_entries")
    .insert([
      {
        product_id: entryData.product_id,
        sabor_id: entryData.sabor_id,
        cantidad: entryData.cantidad,
      },
    ])
    .select()
    .single();

  if (entryError) throw entryError;

  // Actualizar o crear en stock
  const { data: existingStock } = await supabase
    .from("stock")
    .select("*")
    .eq("product_id", entryData.product_id)
    .eq("sabor_id", entryData.sabor_id)
    .maybeSingle();

  if (existingStock) {
    // Actualizar stock existente
    const { error: updateError } = await supabase
      .from("stock")
      .update({
        cantidad_disponible:
          existingStock.cantidad_disponible + entryData.cantidad,
        ultima_actualizacion: new Date().toISOString(),
      })
      .eq("id", existingStock.id);

    if (updateError) throw updateError;
  } else {
    // Crear nuevo registro de stock
    const { error: createError } = await supabase.from("stock").insert([
      {
        product_id: entryData.product_id,
        sabor_id: entryData.sabor_id,
        cantidad_disponible: entryData.cantidad,
        cantidad_minima: 10,
      },
    ]);

    if (createError) throw createError;
  }

  return entry;
};

// Suscripción a cambios
export const subscribeToAlmacen = (callback) => {
  return supabase
    .channel("almacen")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "products" },
      callback
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "stock_entries" },
      callback
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "stock" },
      callback
    )
    .subscribe();
};

// Obtener historial de entradas de un producto
export const getStockEntriesByProduct = async (productId) => {
  const { data, error } = await supabase
    .from("stock_entries")
    .select(
      `
      *,
      sabores (
        id,
        nombre
      ),
      products (
        id,
        nombre_product,
        prc_menudeo,
        cant_paquete
      )
    `
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
