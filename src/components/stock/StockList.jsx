import { format } from "date-fns";
import { es } from "date-fns/locale";
import { deleteStock } from "../../services/stockService";
import Swal from "sweetalert2";

export default function StockList({ stock, loading, onEdit, onDelete }) {
  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: `¿Eliminar stock de ${item.products?.nombre_product} - ${item.sabores?.nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteStock(item.id);
      await Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El registro de stock ha sido eliminado.",
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

  const getStockStatus = (disponible, minimo) => {
    if (disponible === 0) return { badge: "status-neutral", text: "Agotado" };
    if (disponible <= minimo)
      return { badge: "status-warning", text: "Stock Bajo" };
    return { badge: "status-success", text: "Stock OK" };
  };

  if (loading) {
    return (
      <div className="customers-list">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customers-list">
      <div className="section-header">
        <h2>📦 Inventario de Stock ({stock.length})</h2>
      </div>

      {stock.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No hay stock registrado</h2>
          <p>Comienza registrando tu primer producto en stock</p>
        </div>
      ) : (
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Sabor</th>
                <th>Cantidad Disponible</th>
                <th>Stock Mínimo</th>
                <th>Estado</th>
                <th>Última Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => {
                const status = getStockStatus(
                  item.cantidad_disponible,
                  item.cantidad_minima
                );
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="customer-name">
                        <span className="customer-avatar">
                          {item.products?.nombre_product
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                        {item.products?.nombre_product || "N/A"}
                      </div>
                    </td>
                    <td>
                      <span className="status-badge status-info">
                        {item.sabores?.nombre || "N/A"}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: "16px" }}>
                        {item.cantidad_disponible}
                      </strong>{" "}
                      cajas
                    </td>
                    <td className="text-muted">{item.cantidad_minima} cajas</td>
                    <td>
                      <span className={`status-badge ${status.badge}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="customer-date">
                      {item.ultima_actualizacion
                        ? format(
                            new Date(item.ultima_actualizacion),
                            "d MMM yyyy, HH:mm",
                            { locale: es }
                          )
                        : "N/A"}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-action"
                          onClick={() => onEdit(item)}
                          title="Editar stock"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action danger"
                          onClick={() => handleDelete(item)}
                          title="Eliminar stock"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
