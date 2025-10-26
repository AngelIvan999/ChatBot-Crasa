import { useState } from "react";
import PromotionForm from "../components/promotions/PromotionForm.jsx";
import PromotionsList from "../components/promotions/PromotionList.jsx";

export default function PromotionsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="promotions-page">
      <div className="page-header">
        <div>
          <h1>Promociones</h1>
          <p className="page-subtitle">
            Crea y gestiona plantillas de marketing para tus clientes
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "❌ Cancelar" : "➕ Nueva Promoción"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <PromotionForm onClose={() => setShowForm(false)} />
        </div>
      )}

      <PromotionsList />
    </div>
  );
}
