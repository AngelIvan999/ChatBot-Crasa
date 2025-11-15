import { useState } from "react";
import ProductForm from "../components/products/ProductForm";
import StockEntryForm from "../components/almacen/StockEntryForm";
import AlmacenList from "../components/almacen/AlmacenList";
import { useAlmacen } from "../hooks/useAlmacen";
import Modal from "../components/common/Modal";
import InvoiceUploader from "../components/almacen/InvoiceUploader";

export default function AlmacenPage() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { almacen, sabores, loading, error, refreshAlmacen } = useAlmacen();
  const [showInvoiceUploader, setShowInvoiceUploader] = useState(false);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleSuccess = () => {
    setShowProductForm(false);
    setShowEntryForm(false);
    setEditingProduct(null);
    refreshAlmacen();
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
          <h1>Almacen</h1>
          <p className="page-subtitle">
            Gestiona productos, sabores y control de inventario
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="btn-primary"
            onClick={() => setShowInvoiceUploader(true)}
            style={{ background: "#f59e0b" }}
          >
            📄 Cargar Factura
          </button>
          <button
            className="btn-secondary"
            onClick={() => setShowEntryForm(true)}
          >
            📥 Registrar Entrada
          </button>
          <button
            className="btn-primary"
            onClick={() => setShowProductForm(true)}
          >
            ➕ Nuevo Producto
          </button>
        </div>
      </div>

      <Modal
        isOpen={showProductForm}
        onClose={handleCloseProductForm}
        size="medium"
      >
        <ProductForm
          product={editingProduct}
          saboresDisponibles={sabores}
          onClose={handleCloseProductForm}
          onSuccess={handleSuccess}
        />
      </Modal>

      <Modal
        isOpen={showEntryForm}
        onClose={() => setShowEntryForm(false)}
        size="medium"
      >
        <StockEntryForm
          products={almacen}
          sabores={sabores}
          onClose={() => setShowEntryForm(false)}
          onSuccess={handleSuccess}
        />
      </Modal>

      <Modal
        isOpen={showInvoiceUploader}
        onClose={() => setShowInvoiceUploader(false)}
        size="large"
      >
        <InvoiceUploader
          onClose={() => setShowInvoiceUploader(false)}
          onSuccess={handleSuccess}
        />
      </Modal>

      <AlmacenList
        almacen={almacen}
        loading={loading}
        onEdit={handleEdit}
        onDelete={refreshAlmacen}
      />
    </div>
  );
}
