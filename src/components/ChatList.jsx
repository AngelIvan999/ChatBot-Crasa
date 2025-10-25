import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function ChatList({
  users,
  selectedUser,
  onSelectUser,
  loading,
}) {
  if (loading) {
    return (
      <div className="chat-list">
        <div className="chat-list-header">
          <h1>Conversaciones</h1>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h1>Conversaciones</h1>
        <span className="chat-count">{users.length} chats</span>
      </div>

      <div className="chat-list-items">
        {users.length === 0 ? (
          <div className="empty-chats">
            <p>No hay conversaciones disponibles</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className={`chat-item ${
                selectedUser?.id === user.id ? "active" : ""
              }`}
              onClick={() => onSelectUser(user)}
            >
              <div className="chat-avatar">
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : user.phone.charAt(0)}
              </div>
              <div className="chat-info">
                <div className="chat-header-info">
                  <h3>{user.name || "Usuario sin nombre"}</h3>
                  {user.last_seen_at && (
                    <span className="chat-time">
                      {formatDistanceToNow(new Date(user.last_seen_at), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  )}
                </div>
                <p className="chat-phone">{user.phone}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
