import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

export default function ChatMenu({ user, onUserBlocked }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleBlockUser = async () => {
    setShowMenu(false);

    const isBlocked = user.metadata?.blocked === true;
    const action = isBlocked ? "desbloquear" : "bloquear";
    const actionPast = isBlocked ? "desbloqueado" : "bloqueado";

    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} usuario?`,
      text: isBlocked
        ? `${user.name || user.phone} podrá volver a enviar mensajes`
        : `${user.name || user.phone} no podrá enviar mensajes`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#3085d6" : "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const API_URL = (
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      ).replace(/\/$/, "");
      const response = await fetch(`${API_URL}/api/user/${user.id}/block`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blocked: !isBlocked }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Error al ${action} usuario`);
      }

      await Swal.fire({
        icon: "success",
        title: `Usuario ${actionPast}`,
        text: data.message,
        timer: 1500,
        showConfirmButton: false,
      });

      onUserBlocked();
    } catch (error) {
      console.error(`Error ${action}ando usuario:`, error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || `No se pudo ${action} el usuario`,
      });
    }
  };

  return (
    <div className="chat-menu-container" ref={menuRef}>
      <button
        className="chat-menu-button"
        onClick={() => setShowMenu(!showMenu)}
      >
        ⋮
      </button>

      {showMenu && (
        <div className="chat-dropdown-menu">
          <button className="chat-menu-item danger" onClick={handleBlockUser}>
            <span>{user.metadata?.blocked ? "✅" : "🚫"}</span>
            <span>{user.metadata?.blocked ? "Desbloquear" : "Bloquear"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
