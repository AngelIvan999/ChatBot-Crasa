import { useState } from "react";
import { registrarEntrada } from "../../services/almacenService";
import Swal from "sweetalert2";

export default function StockEntryForm({
  products,
  sabores,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    product_id: "",
    sabor_id: "",
    cantidad: "",
  });
  const [loading, setLoading] = useState(false);

  const isFormValid = () => {
    return (
      formData.product_id !== "" &&
      formData.sabor_id !== "" &&
      formData.cantidad !== "" &&
      parseInt(formData.cantidad) > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos",
      });
      return;
    }

    setLoading(true);

    try {
      await registrarEntrada({
        product_id: parseInt(formData.product_id),
        sabor_id: parseInt(formData.sabor_id),
        cantidad: parseInt(formData.cantidad),
      });

      await Swal.fire({
        icon: "success",
        title: "Entrada registrada",
        text: "El stock se actualizó correctamente",
        timer: 1800,
        showConfirmButton: false,
      });

      onSuccess();
    } catch (err) {
      console.error("Error registrando entrada:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo registrar la entrada",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-form-wrapper">
      <div className="form-section">
        <h2>📦 Registrar Entrada de Stock</h2>

        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-group">
            <label htmlFor="product_id">Producto *</label>
            <select
              id="product_id"
              value={formData.product_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  product_id: e.target.value,
                  sabor_id: "",
                })
              }
              required
            >
              <option value="">Selecciona un producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nombre_product}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sabor_id">Sabor *</label>
            <select
              id="sabor_id"
              value={formData.sabor_id}
              onChange={(e) =>
                setFormData({ ...formData, sabor_id: e.target.value })
              }
              disabled={!formData.product_id}
              required
            >
              <option value="">Selecciona un sabor</option>
              {sabores.map((sabor) => (
                <option key={sabor.id} value={sabor.id}>
                  {sabor.nombre}
                </option>
              ))}
            </select>
            {!formData.product_id && (
              <small className="input-hint">
                Primero selecciona un producto
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="cantidad">Cantidad de Cajas *</label>
            <input
              type="number"
              id="cantidad"
              min="1"
              placeholder="50"
              value={formData.cantidad}
              onChange={(e) =>
                setFormData({ ...formData, cantidad: e.target.value })
              }
              required
            />
            <small className="input-hint">
              Numero de cajas que ingresan al almacen
            </small>
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
              {loading ? "Registrando..." : "Registrar Entrada"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
