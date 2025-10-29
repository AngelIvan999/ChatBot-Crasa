import { useState } from "react";
import PromotionPreview from "./PromotionPreview";

export default function PromotionForm({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    image: null,
    imagePreview: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Promoción guardada:", formData);
    alert("Promoción creada exitosamente (funcionalidad pendiente)");
  };

  return (
    <div className="promotion-form-wrapper">
      <div className="form-section">
        <h2>📝 Crear Nueva Promoción</h2>

        <form onSubmit={handleSubmit} className="promotion-form">
          <div className="form-group">
            <label htmlFor="title">Título de la Promoción</label>
            <input
              type="text"
              id="title"
              placeholder="Ej: Promoción 2x1 en Jugos JUMEX"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Imagen de la Promoción</label>
            <div className="image-upload">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
              <label htmlFor="image" className="file-label">
                {formData.imagePreview ? (
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">📸</span>
                    <p>Haz clic para subir una imagen</p>
                    <p className="upload-hint">PNG, JPG hasta 5MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensaje de la Promoción</label>
            <textarea
              id="message"
              rows="6"
              placeholder="Ej: ❗En la compra de 1 paquete de jugosa llévate el segundo completamente gratis ❗🤩"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
            />
            <p className="char-count">{formData.message.length} caracteres</p>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              💾 Guardar Promoción
            </button>
          </div>
        </form>
      </div>

      <div className="preview-section">
        <PromotionPreview data={formData} />
      </div>
    </div>
  );
}
