import { useState } from "react";
import CustomerForm from "../components/customers/CustomerForm";
import CustomerList from "../components/customers/CustomerList";
import { useCustomers } from "../hooks/useCustomers";

export default function CustomersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const { customers, loading, error, refreshCustomers } = useCustomers();

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleSuccess = () => {
    handleCloseForm();
    refreshCustomers();
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
          <h1>Clientes</h1>
          <p className="page-subtitle">
            Gestiona la lista de clientes y datos de contacto
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "❌ Cancelar" : "➕ Nuevo Cliente"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <CustomerForm
            customer={editingCustomer}
            onClose={handleCloseForm}
            onSuccess={handleSuccess}
          />
        </div>
      )}

      <CustomerList
        customers={customers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={refreshCustomers}
      />
    </div>
  );
}
