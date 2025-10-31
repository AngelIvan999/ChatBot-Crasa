import { useState } from "react";
import ProductForm from "../components/products/ProductForm";
import ProductList from "../components/products/ProductList";
import { useProducts } from "../hooks/useProducts";

export default function ProductsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { products, sabores, loading, error, refreshData } = useProducts();

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    refreshData();
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
          <h1>Productos</h1>
          <p className="page-subtitle">
            Gestiona el catálogo de productos y sus sabores disponibles
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "❌ Cancelar" : "➕ Nuevo Producto"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <ProductForm
            product={editingProduct}
            saboresDisponibles={sabores}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        </div>
      )}

      <ProductList
        products={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={refreshData}
      />
    </div>
  );
}
