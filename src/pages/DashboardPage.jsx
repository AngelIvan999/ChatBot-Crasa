import StatsCard from "../components/dashboard/StatsCard";
import RecentTickets from "../components/dashboard/RecentTickets";
import { useState, useEffect } from "react";
import { getSalesStats } from "../services/salesService";

export default function DashboardPage() {
  const [stats, setStats] = useState([
    {
      title: "Ventas Totales",
      value: "0",
      icon: "💰",
      trend: "",
      trendUp: true,
    },
    {
      title: "Conversaciones Activas",
      value: "0",
      icon: "💬",
      trend: "",
      trendUp: true,
    },
    /*{
      title: "Tickets Pendientes",
      value: "12",
      icon: "🎫",
      trend: "-3",
      trendUp: false,
    },*/
    {
      title: "Promociones Activas",
      value: "0",
      icon: "🎁",
      trend: "",
      trendUp: true,
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getSalesStats();
      setStats([
        {
          title: "Ventas Totales",
          value: `$${data.totalSales.toLocaleString()}`,
          icon: "💰",
          trend: `${data.salesCount} ventas`,
          trendUp: true,
        },
        {
          title: "Conversaciones Activas",
          value: String(data.activeChats),
          icon: "💬",
          trend: "Último mes",
          trendUp: true,
        },
        {
          title: "Promociones Activas",
          value: String(data.activePromotions),
          icon: "🎁",
          trend: "+2",
          trendUp: true,
        },
      ]);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Resumen general de chatbot y ventas</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-content">
        <RecentTickets />
      </div>
    </div>
  );
}
