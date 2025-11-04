import { supabase } from "../supabase/supabase.config";

// PRODUCTOS
export const getProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createProduct = async (productData) => {
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        nombre_product: productData.nombre_product,
        prc_menudeo: productData.prc_menudeo,
        cant_paquete: productData.cant_paquete,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProduct = async (id, productData) => {
  const { data, error } = await supabase
    .from("products")
    .update({
      nombre_product: productData.nombre_product,
      prc_menudeo: productData.prc_menudeo,
      cant_paquete: productData.cant_paquete,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProduct = async (id) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
};

// SABORES
export const getSabores = async () => {
  const { data, error } = await supabase
    .from("sabores")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) throw error;
  return data;
};

export const createSabor = async (saborData) => {
  const { data, error } = await supabase
    .from("sabores")
    .insert([
      {
        nombre: saborData.nombre,
        descripcion: saborData.descripcion || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// PRODUCTO_SABORES (relaciones)
export const getProductoSabores = async (productId) => {
  const { data, error } = await supabase
    .from("producto_sabores")
    .select("*, sabores(*)")
    .eq("product_id", productId);

  if (error) throw error;
  return data;
};

export const createProductoSabor = async (productId, saborId) => {
  const { data, error } = await supabase
    .from("producto_sabores")
    .insert([
      {
        product_id: productId,
        sabor_id: saborId,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProductoSabor = async (productId, saborId) => {
  const { error } = await supabase
    .from("producto_sabores")
    .delete()
    .eq("product_id", productId)
    .eq("sabor_id", saborId);

  if (error) throw error;
};

export const subscribeToProducts = (callback) => {
  return supabase
    .channel("products")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "products",
      },
      callback
    )
    .subscribe();
};
