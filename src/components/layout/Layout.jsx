import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const location = useLocation();

  // Determinar página actual basado en pathname
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes("/chats")) return "chats";
    if (path.includes("/customers")) return "customers";
    if (path.includes("/almacen")) return "almacen";
    if (path.includes("/promotions")) return "promotions";
    return "dashboard";
  };

  return (
    <div className="app-layout">
      <Sidebar currentPage={getCurrentPage()} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
