import { useState, useEffect } from "react";
import {
  getStock,
  getStockBajo,
  verificarDisponibilidad,
  subscribeToStock,
} from "../services/stockService";

export const useStock = () => {
  const [stock, setStock] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [faltantes, setFaltantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const channel = subscribeToStock((payload) => {
      console.log("Cambio en stock:", payload);
      loadData();
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stockData, stockBajoData, faltantesData] = await Promise.all([
        getStock(),
        getStockBajo(),
        verificarDisponibilidad(),
      ]);
      setStock(stockData);
      setStockBajo(stockBajoData);
      setFaltantes(faltantesData);
      setError(null);
    } catch (err) {
      console.error("Error cargando stock:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    stock,
    stockBajo,
    faltantes,
    loading,
    error,
    refreshStock: loadData,
  };
};
