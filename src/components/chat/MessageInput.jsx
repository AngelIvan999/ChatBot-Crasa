import { useState } from "react";

export default function MessageInput({ user, onMessageSent }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || sending) return;

    setSending(true);
    setError(null);

    try {
      const { sendMessage } = await import("../../services/messageService");
      await sendMessage(user.phone, message.trim());

      setMessage("");
      if (onMessageSent) onMessageSent();
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      setError(err.message || "Error al enviar el mensaje");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      {error && <div className="message-error">⚠️ {error}</div>}
      <form onSubmit={handleSubmit} className="message-input-form">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
          className="message-textarea"
          rows="1"
          disabled={sending}
        />
        <button
          type="submit"
          className="send-button"
          disabled={!message.trim() || sending}
        >
          {sending ? "⏳" : "📤"}
        </button>
      </form>
    </div>
  );
}
