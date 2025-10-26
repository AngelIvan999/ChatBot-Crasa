import { useState } from "react";
import Layout from "./components/layout/Layout";
import ChatPage from "./pages/ChatPage";
import DashboardPage from "./pages/DashboardPage";
import PromotionsPage from "./pages/PromotionsPage";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("chats");

  const renderPage = () => {
    switch (currentPage) {
      case "chats":
        return <ChatPage />;
      case "dashboard":
        return <DashboardPage />;
      case "promotions":
        return <PromotionsPage />;
      default:
        return <ChatPage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
