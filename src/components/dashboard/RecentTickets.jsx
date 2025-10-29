export default function RecentTickets() {
  const tickets = [
    {
      id: "TKT-001",
      customer: "Juan Pérez",
      product: "JUMEX Uva 2x1",
      amount: "$45.00",
      status: "completado",
      date: "25 Oct, 2025",
    },
    {
      id: "TKT-002",
      customer: "María González",
      product: "JUMEX Guayaba 2x1",
      amount: "$45.00",
      status: "pendiente",
      date: "25 Oct, 2025",
    },
    {
      id: "TKT-003",
      customer: "Carlos Ramírez",
      product: "Combo Especial",
      amount: "$120.00",
      status: "completado",
      date: "24 Oct, 2025",
    },
    {
      id: "TKT-004",
      customer: "Ana López",
      product: "JUMEX Mango 2x1",
      amount: "$45.00",
      status: "procesando",
      date: "24 Oct, 2025",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completado":
        return "status-success";
      case "pendiente":
        return "status-warning";
      case "procesando":
        return "status-info";
      default:
        return "";
    }
  };

  return (
    <div className="recent-tickets">
      <div className="section-header">
        <h2>Tickets Recientes</h2>
        <button className="btn-text">Ver todos →</button>
      </div>

      <div className="tickets-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Monto</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="ticket-id">{ticket.id}</td>
                <td>{ticket.customer}</td>
                <td>{ticket.product}</td>
                <td className="ticket-amount">{ticket.amount}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusColor(ticket.status)}`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="ticket-date">{ticket.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
