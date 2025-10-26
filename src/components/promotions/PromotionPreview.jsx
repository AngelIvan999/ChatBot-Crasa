export default function PromotionPreview({ data }) {
  return (
    <div className="promotion-preview">
      <h3>📱 Vista Previa</h3>
      <p className="preview-subtitle">Así se verá tu promoción en WhatsApp</p>

      <div className="whatsapp-preview">
        <div className="whatsapp-header">
          <div className="whatsapp-avatar">🤖</div>
          <div className="whatsapp-info">
            <p className="whatsapp-name">ChatBot</p>
            <p className="whatsapp-status">en línea</p>
          </div>
        </div>

        <div className="whatsapp-messages">
          <div className="message-bubble-preview incoming">
            {data.imagePreview && (
              <div className="message-image">
                <img src={data.imagePreview} alt="Promoción" />
              </div>
            )}
            <div className="message-content-preview">
              <p className="message-text-preview">
                {data.message || "El mensaje de tu promoción aparecerá aquí..."}
              </p>
              <span className="message-time-preview">10:30</span>
            </div>
          </div>
        </div>
      </div>

      <div className="preview-info">
        <p>
          💡 <strong>Tip:</strong> Usa emojis para hacer tu mensaje más
          atractivo
        </p>
      </div>
    </div>
  );
}
