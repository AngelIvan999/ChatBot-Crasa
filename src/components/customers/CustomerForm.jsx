import { useState, useEffect } from "react";
import { createCustomer, updateCustomer } from "../../services/customerService";

export default function CustomerForm({ customer, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    startDate: "",
    frequency: "Semanal",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextDate, setNextDate] = useState("");

  useEffect(() => {
    if (customer) {
      const phoneWithoutPrefix = customer.phone.startsWith("521")
        ? customer.phone.substring(3)
        : customer.phone;

      setFormData({
        name: customer.name || "",
        phone: phoneWithoutPrefix,
        startDate: customer.metadata?.startDate || "",
        frequency: customer.metadata?.frequency || "Semanal",
      });
    }
  }, [customer]);

  useEffect(() => {
    calculateNextDate();
  }, [formData.startDate, formData.frequency]);

  const calculateNextDate = () => {
    if (!formData.startDate) {
      setNextDate("");
      return;
    }

    const start = new Date(formData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let daysToAdd = 0;
    switch (formData.frequency) {
      case "Semanal":
        daysToAdd = 7;
        break;
      case "Quincenal":
        daysToAdd = 15;
        break;
      case "Mensual":
        daysToAdd = 30;
        break;
    }

    // Calcular la próxima fecha desde la fecha de inicio
    let next = new Date(start);
    while (next <= today) {
      next.setDate(next.getDate() + daysToAdd);
    }

    setNextDate(next.toISOString().split("T")[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fullPhone = `521${formData.phone}`;

      const customerData = {
        name: formData.name,
        phone: fullPhone,
        metadata: {
          startDate: formData.startDate,
          frequency: formData.frequency,
          nextDate: nextDate,
        },
      };

      if (customer) {
        await updateCustomer(customer.id, customerData);
      } else {
        await createCustomer(customerData);
      }

      onSuccess();
    } catch (err) {
      console.error("Error guardando cliente:", err);
      setError(err.message || "Error al guardar el cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-form-wrapper">
      <div className="form-section">
        <h2>{customer ? "✏️ Editar Cliente" : "➕ Nuevo Cliente"}</h2>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-group">
            <label htmlFor="name">Nombre del Cliente / Tienda *</label>
            <input
              type="text"
              id="name"
              placeholder="Ej: Tienda San Luis, Juan Pérez"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Número de Teléfono *</label>
            <div className="phone-input-container">
              <span className="phone-prefix">+52</span>
              <input
                type="text"
                id="phone"
                className="phone-input"
                placeholder="7771234567"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData({ ...formData, phone: value });
                }}
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
            </div>
            <small className="input-hint">Ingresa 10 dígitos sin el +52</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Fecha de Inicio</label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="frequency">Frecuencia de Pedido</label>
              <select
                id="frequency"
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
              >
                <option value="Semanal">Semanal</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Mensual">Mensual</option>
              </select>
            </div>
          </div>

          {formData.startDate && (
            <div className="form-group">
              <label htmlFor="nextDate">Próxima Fecha de Corte</label>
              <input
                type="date"
                id="nextDate"
                value={nextDate}
                disabled
                className="input-disabled"
              />
              <small className="input-hint">
                Se calcula automáticamente según la frecuencia
              </small>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? "Guardando..."
                : customer
                ? "💾 Actualizar Cliente"
                : "💾 Guardar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
