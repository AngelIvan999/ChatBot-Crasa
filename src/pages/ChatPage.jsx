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
    refreshMessages,
  } = useChats();

  const handleChatCleared = (userId) => {
    refreshUsers();

    if (selectedUser?.id === userId) {
      refreshMessages();
    }
  };

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
        onRefresh={handleChatCleared}
      />
      <ChatMessages
        user={selectedUser}
        messages={messages}
        loading={loading && selectedUser !== null}
      />
    </div>
  );
}
