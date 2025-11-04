import { useState, useEffect } from "react";
import {
  deleteProduct,
  getProductoSabores,
} from "../../services/productService";
import Swal from "sweetalert2";

export default function ProductList({ products, loading, onEdit, onDelete }) {
  const [productSabores, setProductSabores] = useState({});

  useEffect(() => {
    loadAllProductSabores();
  }, [products]);

  const loadAllProductSabores = async () => {
    const saboresMap = {};
    for (const product of products) {
      try {
        const sabores = await getProductoSabores(product.id);
        saboresMap[product.id] = sabores.map((ps) => ps.sabores.nombre);
      } catch (error) {
        console.error(
          `Error cargando sabores del producto ${product.id}:`,
          error
        );
        saboresMap[product.id] = [];
      }
    }
    setProductSabores(saboresMap);
  };

  const handleDelete = async (product) => {
    const result = await Swal.fire({
      title: `¿Eliminar "${product.nombre_product}"?`,
      text: "Esta acción eliminará el producto y sus relaciones con sabores.",
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
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customers-list">
      <div className="section-header">
        <h2>📦 Lista de Productos ({products.length})</h2>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No hay productos registrados</h2>
          <p>Comienza agregando tu primer producto con el botón de arriba</p>
        </div>
      ) : (
        <div className="customers-table">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio Menudeo</th>
                <th>Piezas/Caja</th>
                <th>Sabores Disponibles</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="customer-name">
                      <span className="customer-avatar">
                        {product.nombre_product.charAt(0).toUpperCase()}
                      </span>
                      {product.nombre_product}
                    </div>
                  </td>
                  <td className="customer-phone">
                    ${parseFloat(product.prc_menudeo).toFixed(2)}
                  </td>
                  <td>{product.cant_paquete} piezas</td>
                  <td>
                    <div className="sabores-list">
                      {productSabores[product.id] ? (
                        productSabores[product.id].length > 0 ? (
                          productSabores[product.id].map((sabor, idx) => (
                            <span
                              key={idx}
                              className="status-badge status-info"
                            >
                              {sabor}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted">Sin sabores</span>
                        )
                      ) : (
                        <span className="text-muted">Cargando...</span>
                      )}
                    </div>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
