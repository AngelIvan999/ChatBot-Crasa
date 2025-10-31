import { useState, useEffect } from "react";
import {
  getProducts,
  getSabores,
  subscribeToProducts,
} from "../services/productService";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [sabores, setSabores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const channel = subscribeToProducts((payload) => {
      console.log("Cambio en productos:", payload);
      loadData();
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, saboresData] = await Promise.all([
        getProducts(),
        getSabores(),
      ]);
      setProducts(productsData);
      setSabores(saboresData);
      setError(null);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    sabores,
    loading,
    error,
    refreshData: loadData,
  };
};
