import { useState, useEffect } from "react";
import {
  getAlmacenCompleto,
  subscribeToAlmacen,
} from "../services/almacenService";
import { getSabores } from "../services/productService";

export const useAlmacen = () => {
  const [almacen, setAlmacen] = useState([]);
  const [sabores, setSabores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const channel = subscribeToAlmacen(() => {
      loadData();
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [almacenData, saboresData] = await Promise.all([
        getAlmacenCompleto(),
        getSabores(),
      ]);
      setAlmacen(almacenData);
      setSabores(saboresData);
      setError(null);
    } catch (err) {
      console.error("Error cargando almacén:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    almacen,
    sabores,
    loading,
    error,
    refreshAlmacen: loadData,
  };
};
