import { useState, useEffect } from "react";
import { createCustomer, updateCustomer } from "../../services/customerService";

export default function CustomerForm({ customer, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    startDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateError, setDateError] = useState("");
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
      });
    }
  }, [customer]);

  useEffect(() => {
    calculateNextDate();
    validateDate();
  }, [formData.startDate]);

  const validateDate = () => {
    if (!formData.startDate) {
      setDateError("");
      return false;
    }

    const selected = new Date(formData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected <= today) {
      setDateError("⚠️ La fecha de inicio debe ser posterior a hoy");
      return false;
    }

    setDateError("");
    return true;
  };

  const calculateNextDate = () => {
    if (!formData.startDate) {
      setNextDate("");
      return;
    }

    const start = new Date(formData.startDate);
    start.setDate(start.getDate() + 7); // Siempre sumar 7 días (semanal)
    setNextDate(start.toISOString().split("T")[0]);
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.phone.length === 10 &&
      formData.startDate !== "" &&
      !dateError
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fullPhone = `521${formData.phone}`;

      const customerData = {
        name: formData.name,
        phone: fullPhone,
        metadata: {
          startDate: formData.startDate,
          frequency: "Semanal", // Siempre semanal
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

  // Obtener fecha mínima (mañana)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
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
            <label htmlFor="phone">Número de Telefono *</label>
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

          <div className="form-group">
            <label htmlFor="startDate">Fecha de Inicio del Pedido *</label>
            <input
              type="date"
              id="startDate"
              className={`date-input ${dateError ? "input-error" : ""}`}
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              min={getMinDate()}
              required
            />
            {dateError && <small className="error-hint">{dateError}</small>}
            <small className="input-hint">
              Debe ser una fecha futura (no hoy ni anteriores)
            </small>
          </div>

          {formData.startDate && !dateError && (
            <div className="dates">
              <div className="next-date-preview">
                <div className="preview-label">📅 Primer Pedido (Semanal)</div>
                <div className="preview-date">
                  {new Date(formData.startDate).toLocaleDateString("es-MX", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <div className="next-date-preview">
                <div className="preview-label">📅 Próximo Pedido (Semanal)</div>
                <div className="preview-date">
                  {new Date(nextDate).toLocaleDateString("es-MX", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>{" "}
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
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !isFormValid()}
            >
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
