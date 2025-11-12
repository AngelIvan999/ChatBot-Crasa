import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function StockAlerts({ stockBajo, faltantes }) {
  const getStatusBadge = (status) => {
    const badges = {
      cart: { class: "status-neutral", text: "En Carrito" },
      pending: { class: "status-warning", text: "Pendiente" },
      processing: { class: "status-info", text: "Procesando" },
      confirmed: { class: "status-success", text: "Confirmado" },
    };
    return badges[status] || { class: "status-neutral", text: status };
  };

  return (
    <div className="dashboard-content" style={{ marginTop: "24px" }}>
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "1fr 1fr", padding: 0 }}
      >
        {/* Alertas de Stock Bajo */}
        <div className="recent-tickets">
          <div className="section-header">
            <h2>⚠️ Stock Bajo</h2>
            <span className="chat-count">{stockBajo.length} alertas</span>
          </div>

          {stockBajo.length === 0 ? (
            <div className="empty-messages" style={{ padding: "20px" }}>
              <p>Nada que mostrar</p>
            </div>
          ) : (
            <div className="tickets-table">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Sabor</th>
                    <th>Disponible</th>
                    <th>Mínimo</th>
                  </tr>
                </thead>
                <tbody>
                  {stockBajo.map((item) => (
                    <tr key={item.id}>
                      <td className="ticket-id">
                        {item.products?.nombre_product || "N/A"}
                      </td>
                      <td>
                        <span className="status-badge status-info">
                          {item.sabores?.nombre || "N/A"}
                        </span>
                      </td>
                      <td>
                        <span
                          className="ticket-amount"
                          style={{
                            color:
                              item.cantidad_disponible === 0
                                ? "#dc2626"
                                : "#f59e0b",
                          }}
                        >
                          {item.cantidad_disponible}
                        </span>
                      </td>
                      <td className="text-muted">{item.cantidad_minima}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Alertas de Faltantes para Pedidos */}
        <div className="recent-tickets">
          <div className="section-header">
            <h2>🚨 Faltantes para Pedidos</h2>
            <span className="chat-count">{faltantes.length} pedidos</span>
          </div>

          {faltantes.length === 0 ? (
            <div className="empty-messages" style={{ padding: "20px" }}>
              <p>✅ Stock suficiente para todos los pedidos</p>
            </div>
          ) : (
            <div className="tickets-table">
              <table>
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Cliente</th>
                    <th>Estado</th>
                    <th>Productos</th>
                    <th>Faltantes</th>
                  </tr>
                </thead>
                <tbody>
                  {faltantes.map((pedido) => (
                    <tr key={pedido.ticket_id}>
                      <td className="ticket-id">
                        TKT-{String(pedido.ticket_id).padStart(3, "0")}
                      </td>
                      <td>{pedido.cliente}</td>

                      <td>
                        <span
                          className={`status-badge ${
                            getStatusBadge(pedido.status).class
                          }`}
                        >
                          {getStatusBadge(pedido.status).text}
                        </span>
                      </td>
                      <td className="text-muted">{pedido.total_items}</td>
                      <td>
                        <strong
                          className="ticket-amount"
                          style={{ color: "#dc2626", fontSize: "16px" }}
                        >
                          {pedido.total_faltante}
                        </strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
