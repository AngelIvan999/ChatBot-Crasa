import { useState } from "react";
import Layout from "./components/layout/Layout";
import ChatPage from "./pages/ChatPage";
import DashboardPage from "./pages/DashboardPage";
import PromotionsPage from "./pages/PromotionsPage";
import CustomersPage from "./pages/CustomersPage";
import Login from "./pages/Login";
import { AuthContextProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./hooks/ProtectedRoute";
import { Routes, Route } from "react-router-dom";
import { UserAuth } from "./context/AuthContext";
import AlmacenPage from "./pages/AlmacenPage";
import "./App.css";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("chats");
  const { user, loadingSession } = UserAuth();

  if (loadingSession) {
    return <div>Cargando...</div>;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "chats":
        return <ChatPage />;
      case "dashboard":
        return <DashboardPage />;
      case "customers":
        return <CustomersPage />;
      case "almacen":
        return <AlmacenPage />;
      case "promotions":
        return <PromotionsPage />;

      default:
        return <ChatPage />;
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute user={user} redirectTo="/login" />}>
        <Route
          path="/*"
          element={
            <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
              {renderPage()}
            </Layout>
          }
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthContextProvider>
      <AppContent />
    </AuthContextProvider>
  );
}

export default App;
