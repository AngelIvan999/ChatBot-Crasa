import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";

export default function Sidebar({ currentPage, onPageChange }) {
  const [showMenu, setShowMenu] = useState(false);
  const { cerrarSesion } = useAuthStore();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
    },
    {
      id: "chats",
      label: "Conversaciones",
      icon: "💬",
    },
    {
      id: "customers",
      label: "Clientes",
      icon: "👥",
    },
    {
      id: "almacen",
      label: "Almacen",
      icon: "📦",
    },
    {
      id: "promotions",
      label: "Promociones",
      icon: "🎁",
    },
  ];

  const handleLogout = async () => {
    await cerrarSesion();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🤖</span>
          <h2 className="logo-text">Crasa ChatBot</h2>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? "active" : ""}`}
            onClick={() => onPageChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="profile-avatar">A</div>
          <div className="profile-info">
            <p className="profile-name">Admin</p>
            <p className="profile-role">Administrador</p>
          </div>
          <button
            className="profile-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            ⋮
          </button>
        </div>

        {showMenu && (
          <div className="profile-menu">
            <button
              className="profile-menu-item"
              onClick={() => {
                setShowMenu(false);
                alert("Editar perfil (funcionalidad pendiente)");
              }}
            >
              <span>✏️</span>
              <span>Editar Perfil</span>
            </button>
            <button
              className="profile-menu-item danger"
              onClick={() => {
                setShowMenu(false);
                handleLogout();
              }}
            >
              <span>🚪</span>
              <span>Salir</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
