import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function UserInfo({ user }) {
  if (!user) {
    return (
      <div className="user-info-empty">
        <p>Selecciona un chat para ver los mensajes</p>
      </div>
    );
  }

  return (
    <div className="user-info">
      <div className="user-avatar">
        {user.name ? user.name.charAt(0).toUpperCase() : user.phone.charAt(0)}
      </div>
      <div className="user-details">
        <h2>{user.name || "Usuario sin nombre"}</h2>
        <p className="user-phone">{user.phone}</p>
        {user.last_seen_at && (
          <p className="user-last-seen">
            Última actividad:{" "}
            {formatDistanceToNow(new Date(user.last_seen_at), {
              addSuffix: true,
              locale: es,
            })}
          </p>
        )}
      </div>
    </div>
  );
}
