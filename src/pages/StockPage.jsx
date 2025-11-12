import { useState } from "react";
import StockForm from "../components/stock/StockForm";
import StockList from "../components/stock/StockList";
import StockAlerts from "../components/stock/StockAlerts";
import { useStock } from "../hooks/useStock";
import { useProducts } from "../hooks/useProducts";
import Modal from "../components/common/Modal";

export default function StockPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const { stock, stockBajo, faltantes, loading, error, refreshStock } =
    useStock();
  const { products, sabores } = useProducts();

  const handleEdit = (stockItem) => {
    setEditingStock(stockItem);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStock(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    refreshStock();
  };

  if (error) {
    return (
      <div className="error-container">
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <h1>Stock</h1>
          <p className="page-subtitle">
            Gestiona el inventario disponible para surtir pedidos
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "❌ Cancelar" : "➕ Registrar Stock"}
        </button>
      </div>

      <Modal isOpen={showForm} onClose={handleCloseForm} size="medium">
        <StockForm
          stockItem={editingStock}
          products={products}
          sabores={sabores}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      </Modal>

      <StockAlerts stockBajo={stockBajo} faltantes={faltantes} />

      <StockList
        stock={stock}
        loading={loading}
        onEdit={handleEdit}
        onDelete={refreshStock}
      />
    </div>
  );
}
