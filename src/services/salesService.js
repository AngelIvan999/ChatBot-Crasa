import { supabase } from "../supabase/supabase.config";

export const getSalesStats = async () => {
  // Total de ventas
  const { data: sales, error: salesError } = await supabase
    .from("sales")
    .select("total_cents, created_at");

  if (salesError) throw salesError;

  // Total de conversaciones activas (usuarios con last_seen_at reciente)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: activeChats, error: chatsError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .gte("last_seen_at", thirtyDaysAgo.toISOString());

  if (chatsError) throw chatsError;

  // Promociones activas (placeholder por ahora)
  const activePromotions = 4;

  // Calcular total en pesos
  const totalSales =
    sales.reduce((sum, sale) => sum + sale.total_cents, 0) / 100;

  return {
    totalSales: Math.round(totalSales),
    activeChats: activeChats || 0,
    activePromotions,
    salesCount: sales.length,
  };
};

export const getRecentSales = async (limit = 5) => {
  const { data, error } = await supabase
    .from("sales")
    .select(
      `
      id,
      total_cents,
      status,
      created_at,
      ticket_url,
      users:user_id (
        name,
        phone
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data.map((sale) => ({
    id: `TKT-${String(sale.id).padStart(3, "0")}`,
    customer: sale.users?.name || "Usuario sin nombre",
    ticket: sale.ticket_url || "No Hay Ticket",
    amount: `$${(sale.total_cents / 100).toFixed(2)}`,
    status: sale.status === "confirmed" ? "completado" : sale.status,
    date: new Date(sale.created_at).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }));
};
