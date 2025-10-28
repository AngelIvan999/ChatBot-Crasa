import { useState, useEffect } from "react";
import {
  getCustomers,
  subscribeToCustomers,
} from "../services/customerService";

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    // Suscripción a cambios en tiempo real
    const channel = subscribeToCustomers((payload) => {
      console.log("Cambio en clientes:", payload);
      loadCustomers();
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      console.error("Error cargando clientes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    loading,
    error,
    refreshCustomers: loadCustomers,
  };
};
