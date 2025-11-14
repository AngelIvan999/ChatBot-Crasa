import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/AuthStore";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function Sidebar() {
  const [showMenu, setShowMenu] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const { cerrarSesion } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/dashboard" },
    { id: "chats", label: "Conversaciones", icon: "💬", path: "/chats" },
    { id: "customers", label: "Clientes", icon: "👥", path: "/customers" },
    { id: "almacen", label: "Almacen", icon: "📦", path: "/almacen" },
    { id: "promotions", label: "Promociones", icon: "🎁", path: "/promotions" },
  ];

  const handleLogout = async () => {
    await cerrarSesion();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🤖</span>
          {!collapsed && <h2 className="logo-text">Crasa ChatBot</h2>}
        </div>
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expandir" : "Colapsar"}
        >
          {collapsed ? (
            <ChevronRight size={16} strokeWidth={2.5} />
          ) : (
            <ChevronLeft size={16} strokeWidth={2.5} />
          )}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
            onClick={() => navigate(item.path)}
            title={collapsed ? item.label : ""}
          >
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="profile-avatar">A</div>
          {!collapsed && (
            <>
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
            </>
          )}
        </div>

        {showMenu && !collapsed && (
          <div className="profile-menu">
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
