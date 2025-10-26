export default function StatsCard({ title, value, icon, trend, trendUp }) {
  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <p className="stats-title">{title}</p>
        <h3 className="stats-value">{value}</h3>
        {trend && (
          <p className={`stats-trend ${trendUp ? "trend-up" : "trend-down"}`}>
            {trendUp ? "📈" : "📉"} {trend}
          </p>
        )}
      </div>
    </div>
  );
}
