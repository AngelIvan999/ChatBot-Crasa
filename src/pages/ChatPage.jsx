import { useChats } from "../hooks/useChats";
import ChatList from "../components/chat/ChatList";
import ChatMessages from "../components/chat/ChatMessages";

export default function ChatPage() {
  const {
    users,
    selectedUser,
    setSelectedUser,
    messages,
    loading,
    error,
    refreshUsers,
  } = useChats();

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
    <div className="chat-page">
      <ChatList
        users={users}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
        loading={loading && !selectedUser}
        onRefresh={refreshUsers}
      />
      <ChatMessages
        user={selectedUser}
        messages={messages}
        loading={loading && selectedUser !== null}
      />
    </div>
  );
}
