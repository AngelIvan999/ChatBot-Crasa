import { useState, useEffect } from "react";
import { getRecentSales } from "../../services/salesService";
import { Icon } from "@iconify/react";

export default function RecentTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await getRecentSales(5);
      setTickets(data);
    } catch (error) {
      console.error("Error cargando tickets:", error);
    } finally {
      setLoading(false);
    }
  };

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
              <th>Tciket</th>
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
                <td>
                  {ticket.ticket ? (
                    <a
                      href={`https://csmsgulzptwfpaoqonuc.supabase.co/storage/v1/object/public/tickets/${ticket.ticket}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ver-factura"
                    >
                      <Icon icon="line-md:document-twotone" />
                    </a>
                  ) : (
                    <span>-</span>
                  )}
                </td>
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
