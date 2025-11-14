import { deleteProduct } from "../../services/productService";
import Swal from "sweetalert2";
import SaboresPopover from "./SaboresPopover";

export default function AlmacenList({ almacen, loading, onEdit, onDelete }) {
  const handleDelete = async (product) => {
    const result = await Swal.fire({
      title: `¿Eliminar "${product.nombre_product}"?`,
      text: "Esta acción eliminará el producto y todo su historial.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProduct(product.id);
      await Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: "El producto ha sido eliminado correctamente.",
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

  if (loading) {
    return (
      <div className="customers-list">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando almacén...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customers-list">
      <div className="section-header">
        <h2>📦 Inventario ({almacen.length} productos)</h2>
      </div>

      {almacen.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No hay productos registrados</h2>
          <p>Comienza agregando tu primer producto</p>
        </div>
      ) : (
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio Menudeo</th>
                <th>Piezas/Caja</th>
                <th>Sabores</th>
                <th style={{ textAlign: "center" }}>Entradas</th>
                <th style={{ textAlign: "center" }}>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {almacen.map((product) => {
                const saboresArray = Object.values(product.saboresData);
                const totalEntradas = saboresArray.reduce(
                  (sum, s) => sum + s.entradas,
                  0
                );
                const totalStock = saboresArray.reduce(
                  (sum, s) => sum + s.stock,
                  0
                );

                return (
                  <tr key={product.id}>
                    <td>
                      <div className="customer-name">
                        {product.nombre_product}
                      </div>
                    </td>
                    <td className="customer-phone">
                      ${parseFloat(product.prc_menudeo).toFixed(2)}
                    </td>
                    <td>{product.cant_paquete} piezas</td>
                    <td>
                      <SaboresPopover
                        saboresData={product.saboresData}
                        productoNombre={product.nombre_product}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <strong style={{ fontSize: "16px", color: "#3b82f6" }}>
                        {totalEntradas}
                      </strong>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <strong style={{ fontSize: "16px", color: "#059669" }}>
                        {totalStock}
                      </strong>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-action"
                          onClick={() => onEdit(product)}
                          title="Editar producto"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-action danger"
                          onClick={() => handleDelete(product)}
                          title="Eliminar producto"
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
