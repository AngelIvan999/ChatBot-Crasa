import { useChats } from "./hooks/useChats";
import ChatList from "./components/ChatList";
import ChatMessages from "./components/ChatMessages";
import "./App.css";

function App() {
  const { users, selectedUser, setSelectedUser, messages, loading, error } =
    useChats();

  if (error) {
    return (
      <div className="error-container">
        <h1>Error</h1>
        <p>{error}</p>
        <p>Verifica tu configuración de Supabase en el archivo .env</p>
      </div>
    );
  }

  return (
    <div className="app">
      <ChatList
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        loading={loading && !selectedUser}
      />
      <ChatMessages
        user={selectedUser}
        messages={messages}
        loading={loading && selectedUser !== null}
      />
    </div>
  );
}

export default App;
