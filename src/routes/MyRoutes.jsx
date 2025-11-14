import { Routes, Route, Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { ProtectedRoute } from "../hooks/ProtectedRoute";
import Layout from "../components/layout/Layout";

// Pages
import Login from "../pages/Login";
import DashboardPage from "../pages/DashboardPage";
import ChatPage from "../pages/ChatPage";
import CustomersPage from "../pages/CustomersPage";
import AlmacenPage from "../pages/AlmacenPage";
import StockHistoryPage from "../pages/StockHistoryPage";
import PromotionsPage from "../pages/PromotionsPage";

export function MyRoutes() {
  const { user, loadingSession } = UserAuth();

  if (loadingSession) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Cargando sesión...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute user={user} redirectTo="/login" />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/almacen" element={<AlmacenPage />} />
          <Route
            path="/almacen/:productId/historial"
            element={<StockHistoryPage />}
          />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
