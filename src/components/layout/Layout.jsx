import Sidebar from "./Sidebar";

export default function Layout({ children, currentPage, onPageChange }) {
  return (
    <div className="app-layout">
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} />
      <main className="main-content">{children}</main>
    </div>
  );
}
