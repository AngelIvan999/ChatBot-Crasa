export default function PromotionsList() {
  const promotions = [
    {
      id: 1,
      title: "Promoción 2x1 JUMEX Uva",
      message: "❗En la compra de 1 paquete de JUMEX Uva llévate el segundo...",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJhLL6H3D1Q1kFNBzMyl7WwxnnZhZbxkNkhg&s",
      status: "activa",
      sentTo: 245,
      date: "25 Oct, 2025",
    },
    {
      id: 2,
      title: "Promoción 2x1 JUMEX Guayaba",
      message: "🤩 Oferta especial en JUMEX Guayaba. No te lo pierdas...",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvY-s6THzwTj1kChxDnj-HVvlqhbELJH7_CQ&s",
      status: "programada",
      sentTo: 0,
      date: "26 Oct, 2025",
    },
    {
      id: 3,
      title: "Combo Especial Octubre",
      message: "🎁 Combo especial del mes con todos los sabores...",
      image:
        "https://cazaofertas.com.mx/wp-content/uploads/2020/08/cupones-oxxo-2x1-1.jpg",
      status: "finalizada",
      sentTo: 189,
      date: "20 Oct, 2025",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "activa":
        return "status-success";
      case "programada":
        return "status-info";
      case "finalizada":
        return "status-neutral";
      default:
        return "";
    }
  };

  return (
    <div className="promotions-list">
      <h2>📋 Promociones Creadas</h2>

      <div className="promotions-grid">
        {promotions.map((promo) => (
          <div key={promo.id} className="promotion-card">
            <div className="promotion-image-container">
              <img
                src={promo.image}
                alt={promo.title}
                className="promotion-image"
              />
              <span
                className={`promotion-status ${getStatusColor(promo.status)}`}
              >
                {promo.status}
              </span>
            </div>

            <div className="promotion-content">
              <h3 className="promotion-title">{promo.title}</h3>
              <p className="promotion-message">{promo.message}</p>

              <div className="promotion-stats">
                <div className="stat-item">
                  <span className="stat-icon">📤</span>
                  <span className="stat-text">
                    Enviado a {promo.sentTo} clientes
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">📅</span>
                  <span className="stat-text">{promo.date}</span>
                </div>
              </div>

              <div className="promotion-actions">
                <button className="btn-action">👁️ Ver</button>
                <button className="btn-action">✏️ Editar</button>
                <button className="btn-action danger">🗑️ Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
