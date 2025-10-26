import StatsCard from "../components/dashboard/StatsCard";
import RecentTickets from "../components/dashboard/RecentTickets";

export default function DashboardPage() {
  // Datos de ejemplo - más tarde vendrán de la base de datos
  const stats = [
    {
      title: "Ventas Totales",
      value: "245",
      icon: "💰",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Conversaciones Activas",
      value: "38",
      icon: "💬",
      trend: "+5",
      trendUp: true,
    },
    {
      title: "Tickets Pendientes",
      value: "12",
      icon: "🎫",
      trend: "-3",
      trendUp: false,
    },
    {
      title: "Promociones Activas",
      value: "4",
      icon: "🎁",
      trend: "+2",
      trendUp: true,
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Resumen general de tu chatbot y ventas</p>
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
