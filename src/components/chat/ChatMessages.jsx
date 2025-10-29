import { useEffect, useRef } from "react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import MessageBubble from "./MessageBubble";
import UserInfo from "./UserInfo";
import MessageInput from "./MessageInput";

export default function ChatMessages({ user, messages, loading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!user) {
    return (
      <div className="chat-messages-container">
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h2>Bienvenido al Chat Viewer</h2>
          <p>Selecciona un contacto de la izquierda para ver la conversación</p>
        </div>
      </div>
    );
  }

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = format(new Date(message.created_at), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  const hasMessagesToday = () => {
    if (!messages.length) return false;

    const today = new Date();
    return messages.some((msg) => {
      const msgDate = new Date(msg.created_at);
      return isSameDay(msgDate, today);
    });
  };

  return (
    <div className="chat-messages-container">
      <div className="chat-header">
        <UserInfo user={user} />
      </div>

      <div className="messages-list">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando mensajes...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-messages">
            <p>No hay mensajes en esta conversación</p>
          </div>
        ) : (
          <>
            {Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date}>
                <div className="date-separator">
                  <span>
                    {format(new Date(date), "d 'de' MMMM, yyyy", {
                      locale: es,
                    })}
                  </span>
                </div>
                {msgs.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input solo si hay mensajes hoy */}
      {hasMessagesToday() && (
        <MessageInput
          user={user}
          onMessageSent={() => {
            // Refrescar mensajes después de enviar
            if (typeof window !== "undefined") {
              window.location.reload();
            }
          }}
        />
      )}
    </div>
  );
}
