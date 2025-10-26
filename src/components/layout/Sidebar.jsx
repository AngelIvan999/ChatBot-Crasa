export default function Sidebar({ currentPage, onPageChange }) {
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
      id: "promotions",
      label: "Promociones",
      icon: "🎁",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🤖</span>
          <h2 className="logo-text">ChatBot Manager</h2>
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
        </div>
      </div>
    </aside>
  );
}
