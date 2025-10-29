import { useState, useEffect } from "react";
import {
  getUsers,
  getChatHistory,
  subscribeToMessages,
  subscribeToUsers,
} from "../supabase/supabase.config";

export const useChats = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuarios al iniciar
  useEffect(() => {
    loadUsers();
  }, []);

  // Cargar mensajes cuando se selecciona un usuario
  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.id);
    }
  }, [selectedUser]);

  // Suscripción a cambios en tiempo real
  useEffect(() => {
    // Suscribirse a cambios en usuarios
    const usersChannel = subscribeToUsers((payload) => {
      console.log("Usuario actualizado:", payload);
      loadUsers();
    });

    // Suscribirse a mensajes del usuario seleccionado
    let messagesChannel = null;
    if (selectedUser) {
      messagesChannel = subscribeToMessages(selectedUser.id, (payload) => {
        console.log("Nuevo mensaje:", payload);
        setMessages((prev) => [...prev, payload.new]);
      });
    }

    return () => {
      usersChannel.unsubscribe();
      if (messagesChannel) messagesChannel.unsubscribe();
    };
  }, [selectedUser]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId) => {
    try {
      setLoading(true);
      const data = await getChatHistory(userId);
      setMessages(data);
      setError(null);
    } catch (err) {
      console.error("Error cargando mensajes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    selectedUser,
    setSelectedUser,
    messages,
    loading,
    error,
    refreshUsers: loadUsers,
    refreshMessages: () => selectedUser && loadMessages(selectedUser.id),
  };
};
