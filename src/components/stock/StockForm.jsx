import { useState, useEffect } from "react";
import {
  createStock,
  updateStock,
  updateStockMinimo,
} from "../../services/stockService";
import Swal from "sweetalert2";

export default function StockForm({
  stockItem,
  products,
  sabores,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    product_id: "",
    sabor_id: "",
    cantidad_disponible: "",
    cantidad_minima: "10",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stockItem) {
      setFormData({
        product_id: stockItem.product_id,
        sabor_id: stockItem.sabor_id,
        cantidad_disponible: stockItem.cantidad_disponible,
        cantidad_minima: stockItem.cantidad_minima || 10,
      });
    }
  }, [stockItem]);

  const isFormValid = () => {
    return (
      formData.product_id !== "" &&
      formData.sabor_id !== "" &&
      formData.cantidad_disponible !== "" &&
      parseInt(formData.cantidad_disponible) >= 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos requeridos",
      });
      return;
    }

    setLoading(true);

    try {
      if (stockItem) {
        // Actualizar stock existente
        await updateStock(stockItem.id, parseInt(formData.cantidad_disponible));
        await updateStockMinimo(
          stockItem.id,
          parseInt(formData.cantidad_minima)
        );
      } else {
        // Crear nuevo stock
        await createStock({
          product_id: parseInt(formData.product_id),
          sabor_id: parseInt(formData.sabor_id),
          cantidad_disponible: parseInt(formData.cantidad_disponible),
          cantidad_minima: parseInt(formData.cantidad_minima),
        });
      }

      await Swal.fire({
        icon: "success",
        title: stockItem ? "Stock actualizado" : "Stock registrado",
        text: "Los cambios se guardaron exitosamente",
        timer: 1800,
        showConfirmButton: false,
      });

      onSuccess();
    } catch (err) {
      console.error("Error guardando stock:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo guardar el stock",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-form-wrapper">
      <div className="form-section">
        <h2>
          {stockItem ? "✏️ Actualizar Stock" : "➕ Registrar Nuevo Stock"}
        </h2>

        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-group">
            <label htmlFor="product_id">Producto *</label>
            <select
              id="product_id"
              value={formData.product_id}
              onChange={(e) =>
                setFormData({ ...formData, product_id: e.target.value })
              }
              disabled={stockItem}
              required
            >
              <option value="">Selecciona un producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nombre_product}
                </option>
              ))}
            </select>
            {stockItem && (
              <small className="input-hint">
                No se puede cambiar el producto en edición
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="sabor_id">Sabor *</label>
            <select
              id="sabor_id"
              value={formData.sabor_id}
              onChange={(e) =>
                setFormData({ ...formData, sabor_id: e.target.value })
              }
              disabled={stockItem}
              required
            >
              <option value="">Selecciona un sabor</option>
              {sabores.map((sabor) => (
                <option key={sabor.id} value={sabor.id}>
                  {sabor.nombre}
                </option>
              ))}
            </select>
            {stockItem && (
              <small className="input-hint">
                No se puede cambiar el sabor en edición
              </small>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cantidad_disponible">Cantidad Disponible *</label>
              <input
                type="number"
                id="cantidad_disponible"
                min="0"
                placeholder="50"
                value={formData.cantidad_disponible}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cantidad_disponible: e.target.value,
                  })
                }
                required
              />
              <small className="input-hint">Cajas disponibles en stock</small>
            </div>

            <div className="form-group">
              <label htmlFor="cantidad_minima">Stock Mínimo</label>
              <input
                type="number"
                id="cantidad_minima"
                min="0"
                placeholder="10"
                value={formData.cantidad_minima}
                onChange={(e) =>
                  setFormData({ ...formData, cantidad_minima: e.target.value })
                }
              />
              <small className="input-hint">
                Alerta cuando esté por debajo de esta cantidad
              </small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !isFormValid()}
            >
              {loading
                ? "Guardando..."
                : stockItem
                ? "💾 Actualizar Stock"
                : "💾 Registrar Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
