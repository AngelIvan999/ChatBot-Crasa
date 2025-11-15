import { format } from "date-fns";
import { es } from "date-fns/locale";
import { deleteCustomer } from "../../services/customerService";
import Swal from "sweetalert2";

export default function CustomerList({ customers, loading, onEdit, onDelete }) {
  const handleDelete = async (customer) => {
    const result = await Swal.fire({
      title: `¿Eliminar a ${customer.name || customer.phone}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      //showCancelButton: true,
      //confirmButtonColor: "#d33",
      //cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      //cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCustomer(customer.id);
      await Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El cliente ha sido eliminado correctamente.",
        timer: 1800,
        showConfirmButton: false,
      });
      onDelete();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: error.message,
      });
    }
  };

  const formatPhone = (phone) => {
    // Mostrar el numero sin el prefijo 521
    if (phone.startsWith("521")) {
      const number = phone.substring(3);
      return `+52 ${number.substring(0, 3)} ${number.substring(
        3,
        6
      )} ${number.substring(6)}`;
    }
    return phone;
  };

  const getFrequencyBadge = (frequency) => {
    const colors = {
      Semanal: "status-info",
      Quincenal: "status-warning",
      Mensual: "status-success",
    };
    return colors[frequency] || "status-neutral";
  };

  if (loading) {
    return (
      <div className="customers-list">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customers-list">
      <div className="section-header">
        <h2>📋 Clientes ({customers.length})</h2>
      </div>

      {customers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h2>No hay clientes registrados</h2>
          <p>Comienza agregando tu primer cliente con el botón de arriba</p>
        </div>
      ) : (
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Telefono</th>
                <th>Fecha de Inicio</th>
                <th>Frecuencia</th>
                <th>Próximo Corte</th>
                <th>Registrado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div className="customer-name">
                      <span className="customer-avatar">
                        {customer.name
                          ? customer.name.charAt(0).toUpperCase()
                          : "?"}
                      </span>
                      {customer.name || "Sin nombre"}
                    </div>
                  </td>
                  <td className="customer-phone">
                    {formatPhone(customer.phone)}
                  </td>
                  <td>
                    {customer.metadata?.startDate ? (
                      format(
                        new Date(customer.metadata.startDate),
                        "d MMM yyyy",
                        {
                          locale: es,
                        }
                      )
                    ) : (
                      <span className="text-muted">No definida</span>
                    )}
                  </td>
                  <td>
                    {customer.metadata?.frequency ? (
                      <span
                        className={`status-badge ${getFrequencyBadge(
                          customer.metadata.frequency
                        )}`}
                      >
                        {customer.metadata.frequency}
                      </span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td>
                    {customer.metadata?.nextDate ? (
                      <span className="next-date">
                        📅{" "}
                        {format(
                          new Date(customer.metadata.nextDate),
                          "d MMM yyyy",
                          {
                            locale: es,
                          }
                        )}
                      </span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td className="customer-date">
                    {format(new Date(customer.created_at), "d MMM yyyy", {
                      locale: es,
                    })}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-action"
                        onClick={() => onEdit(customer)}
                        title="Editar cliente"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-action danger"
                        onClick={() => handleDelete(customer)}
                        title="Eliminar cliente"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
