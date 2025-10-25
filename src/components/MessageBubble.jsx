import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function MessageBubble({ message }) {
  const isIncoming = message.direction === "incoming";

  const formatTime = (dateString) => {
    return format(new Date(dateString), "HH:mm", { locale: es });
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
  };

  return (
    <div className={`message-bubble ${isIncoming ? "incoming" : "outgoing"}`}>
      <div className="message-content">
        <p className="message-text">{message.message}</p>
        <span className="message-time">{formatTime(message.created_at)}</span>
      </div>
    </div>
  );
}
