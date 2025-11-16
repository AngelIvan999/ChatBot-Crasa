import { useState, useEffect } from "react";
import {
  createProduct,
  updateProduct,
  getProductoSabores,
  createProductoSabor,
  deleteProductoSabor,
  createSabor,
} from "../../services/productService";
import Swal from "sweetalert2";

export default function ProductForm({
  product,
  saboresDisponibles,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    nombre_product: "",
    prc_menudeo: "",
    cant_paquete: "",
  });
  const [selectedSabores, setSelectedSabores] = useState([]);
  const [showNewSaborForm, setShowNewSaborForm] = useState(false);
  const [newSaborName, setNewSaborName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saboresCodigos, setSaboresCodigos] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        nombre_product: product.nombre_product || "",
        prc_menudeo: product.prc_menudeo || "",
        cant_paquete: product.cant_paquete || "",
      });
      loadProductSabores();
    }
  }, [product]);

  const loadProductSabores = async () => {
    if (!product) return;
    try {
      const data = await getProductoSabores(product.id);
      setSelectedSabores(data.map((ps) => ps.sabor_id));
    } catch (error) {
      console.error("Error cargando sabores del producto:", error);
    }
  };

  const handleSaborToggle = (saborId) => {
    setSelectedSabores((prev) =>
      prev.includes(saborId)
        ? prev.filter((id) => id !== saborId)
        : [...prev, saborId]
    );
  };

  const handleCreateNewSabor = async () => {
    if (!newSaborName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campo requerido",
        text: "Por favor ingresa el nombre del sabor",
      });
      return;
    }

    try {
      const newSabor = await createSabor({ nombre: newSaborName.trim() });
      Swal.fire({
        icon: "success",
        title: "Sabor creado",
        text: `El sabor "${newSabor.nombre}" fue creado exitosamente`,
        timer: 1500,
        showConfirmButton: false,
      });
      setSelectedSabores([...selectedSabores, newSabor.id]);
      setNewSaborName("");
      setShowNewSaborForm(false);
      onSuccess(); // Recargar sabores
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear el sabor",
      });
    }
  };

  const isFormValid = () => {
    return (
      formData.nombre_product.trim() !== "" &&
      formData.prc_menudeo !== "" &&
      parseFloat(formData.prc_menudeo) > 0 &&
      formData.cant_paquete !== "" &&
      parseInt(formData.cant_paquete) > 0 &&
      selectedSabores.length > 0
    );
  };

  const handleCodigoChange = (saborId, codigo) => {
    setSaboresCodigos((prev) => ({
      ...prev,
      [saborId]: codigo,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos y selecciona al menos un sabor",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const productData = {
        nombre_product: formData.nombre_product.trim(),
        prc_menudeo: parseFloat(formData.prc_menudeo),
        cant_paquete: parseInt(formData.cant_paquete),
      };

      let savedProduct;
      if (product) {
        // Actualizar producto existente
        savedProduct = await updateProduct(product.id, productData);

        // Actualizar relaciones de sabores
        const currentSabores = await getProductoSabores(product.id);
        const currentSaborIds = currentSabores.map((ps) => ps.sabor_id);

        // Eliminar sabores desmarcados
        for (const saborId of currentSaborIds) {
          if (!selectedSabores.includes(saborId)) {
            await deleteProductoSabor(product.id, saborId);
          }
        }

        // Agregar nuevos sabores
        for (const saborId of selectedSabores) {
          if (!currentSaborIds.includes(saborId)) {
            await createProductoSabor(product.id, saborId);
          }
        }
      } else {
        // Crear nuevo producto
        savedProduct = await createProduct(productData);

        // Crear relaciones de sabores
        for (const saborId of selectedSabores) {
          await createProductoSabor(savedProduct.id, saborId);
        }

        for (const saborId of selectedSabores) {
          const codigo = saboresCodigos[saborId];
          if (codigo) {
            await updateProductoSaborCodigo(savedProduct.id, saborId, codigo);
          }
        }
      }

      await Swal.fire({
        icon: "success",
        title: product ? "Producto actualizado" : "Producto creado",
        text: `El producto "${savedProduct.nombre_product}" fue guardado exitosamente`,
        timer: 1800,
        showConfirmButton: false,
      });

      onSuccess();
    } catch (err) {
      console.error("Error guardando producto:", err);
      setError(err.message || "Error al guardar el producto");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo guardar el producto",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-form-wrapper">
      <div className="form-section">
        <h2>{product ? "✏️ Editar Producto" : "➕ Nuevo Producto"}</h2>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="customer-form">
          <div className="form-group">
            <label htmlFor="nombre_product">Nombre del Producto *</label>
            <input
              type="text"
              id="nombre_product"
              placeholder="Ej: JUMEX 125"
              value={formData.nombre_product}
              onChange={(e) =>
                setFormData({ ...formData, nombre_product: e.target.value })
              }
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prc_menudeo">Precio de Menudeo ($) *</label>
              <input
                type="number"
                id="prc_menudeo"
                step="0.01"
                min="0"
                placeholder="238.00"
                value={formData.prc_menudeo}
                onChange={(e) =>
                  setFormData({ ...formData, prc_menudeo: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cant_paquete">Piezas por Caja *</label>
              <input
                type="number"
                id="cant_paquete"
                min="1"
                placeholder="6"
                value={formData.cant_paquete}
                onChange={(e) =>
                  setFormData({ ...formData, cant_paquete: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Sabores disponibles *</label>
            {/*
            <div className="sabores-grid">
              {saboresDisponibles.map((sabor) => (
                <label key={sabor.id} className="sabor-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedSabores.includes(sabor.id)}
                    onChange={() => handleSaborToggle(sabor.id)}
                  />
                  <span>{sabor.nombre}</span>
                </label>
              ))}
            </div>
            */}

            <div className="sabores-grid">
              {saboresDisponibles.map((sabor) => {
                const isSelected = selectedSabores.includes(sabor.id);
                const codigoActual = saboresCodigos[sabor.id] || "";

                return (
                  <div key={sabor.id} className="sabor-checkbox-wrapper">
                    <label className="sabor-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSaborToggle(sabor.id)}
                      />
                      <span>{sabor.nombre}</span>
                    </label>
                    {isSelected && (
                      <input
                        type="text"
                        className="sabor-codigo-input"
                        placeholder="Código"
                        value={codigoActual}
                        onChange={(e) =>
                          handleCodigoChange(sabor.id, e.target.value)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <small className="input-hint">
              Selecciona al menos un sabor para este producto
            </small>
          </div>

          {!showNewSaborForm ? (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowNewSaborForm(true)}
            >
              ➕ Agregar nuevo sabor
            </button>
          ) : (
            <div className="new-sabor-form">
              <div className="form-group">
                <label htmlFor="newSabor">Nombre del nuevo sabor</label>
                <input
                  type="text"
                  id="newSabor"
                  placeholder="Ej: TAMARINDO"
                  value={newSaborName}
                  onChange={(e) =>
                    setNewSaborName(e.target.value.toUpperCase())
                  }
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowNewSaborForm(false);
                    setNewSaborName("");
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleCreateNewSabor}
                >
                  Crear Sabor
                </button>
              </div>
            </div>
          )}

          <div className="form-actions" style={{ marginTop: "24px" }}>
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
                : product
                ? "💾 Actualizar Producto"
                : "💾 Guardar Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
