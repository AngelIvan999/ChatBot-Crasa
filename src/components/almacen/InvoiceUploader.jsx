import { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { parseCrasaInvoice } from "../../utils/invoiceParser";
import Swal from "sweetalert2";

// Configurar worker correctamente
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

export default function InvoiceUploader({ onSuccess, onClose }) {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      Swal.fire({
        icon: "warning",
        title: "Archivo inválido",
        text: "Por favor selecciona un archivo PDF",
      });
      return;
    }

    setIsProcessing(true);
    setPdfFile(file);

    try {
      // Preview
      const reader = new FileReader();
      reader.onload = (e) => setPdfPreview(e.target.result);
      reader.readAsDataURL(file);

      // Extraer texto
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item) => item.str).join("\n") + "\n";
      }

      const data = parseCrasaInvoice(fullText);
      setExtractedData(data);
    } catch (error) {
      console.error("Error procesando PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo procesar la factura. Verifica que sea un PDF válido de CRASA.",
      });
      setExtractedData(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegister = async () => {
    if (!extractedData || extractedData.productos.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin productos",
        text: "No hay productos válidos para registrar",
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "¿Registrar entradas?",
      html: `
        <p>Se registrarán <strong>${extractedData.cantidadProductos}</strong> productos</p>
        <p>Total: <strong>${extractedData.cantidadTotal}</strong> cajas</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, registrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3b82f6",
    });

    if (!confirm.isConfirmed) return;

    setIsProcessing(true);

    try {
      const { registrarEntradaDesdeFactura } = await import(
        "../../services/almacenService"
      );
      const resultado = await registrarEntradaDesdeFactura(extractedData);

      if (resultado.errores.length > 0) {
        const erroresHtml = resultado.errores
          .map(
            (e) =>
              `<div style="text-align: left; padding: 8px; background: #fee2e2; border-radius: 6px; margin: 4px 0;">
                <strong>Código ${e.codigo}:</strong> ${e.error}
              </div>`
          )
          .join("");

        await Swal.fire({
          icon: "warning",
          title: "Registro parcial",
          html: `
            <p><strong>Exitosos:</strong> ${resultado.exitosos.length}</p>
            <p><strong>Con errores:</strong> ${resultado.errores.length}</p>
            <div style="max-height: 200px; overflow-y: auto; margin-top: 16px;">
              ${erroresHtml}
            </div>
          `,
          confirmButtonText: "Entendido",
        });
      } else {
        await Swal.fire({
          icon: "success",
          title: "¡Entradas registradas!",
          text: `Se registraron ${resultado.exitosos.length} productos correctamente`,
          timer: 2000,
          showConfirmButton: false,
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error registrando entradas:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudieron registrar las entradas",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="invoice-uploader-wrapper">
      <h2>📄 Cargar Factura PDF</h2>

      <div className="upload-section">
        <div className="pdf-upload-area">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="file-input"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="pdf-upload-label">
            {pdfPreview ? (
              <div className="pdf-preview-container">
                <iframe
                  src={pdfPreview}
                  width="100%"
                  height="300px"
                  title="Vista previa de factura"
                />
              </div>
            ) : (
              <div className="upload-placeholder">
                <span className="upload-icon">📄</span>
                <p>Arrastra tu factura PDF aquí</p>
                <p className="upload-hint">o haz clic para seleccionar</p>
                <p className="upload-hint">Archivos PDF hasta 10MB</p>
              </div>
            )}
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={handleRegister}
          disabled={!extractedData || isProcessing}
        >
          {isProcessing ? "⏳ Registrando..." : "Registrar Entradas"}
        </button>
      </div>
    </div>
  );
}
