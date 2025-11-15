import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getStockEntriesByProduct } from "../services/almacenService";
import { ArrowLeft } from "lucide-react";

export default function StockHistoryPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedBySabor, setGroupedBySabor] = useState({});

  useEffect(() => {
    loadData();
  }, [productId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getStockEntriesByProduct(parseInt(productId));

      if (data.length > 0) {
        setProduct(data[0].products);
        setEntries(data);

        // Agrupar por sabor
        const grouped = data.reduce((acc, entry) => {
          const saborNombre = entry.sabores.nombre;
          if (!acc[saborNombre]) {
            acc[saborNombre] = [];
          }
          acc[saborNombre].push(entry);
          return acc;
        }, {});

        setGroupedBySabor(grouped);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPorSabor = (sabor) => {
    return groupedBySabor[sabor].reduce(
      (sum, entry) => sum + entry.cantidad,
      0
    );
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h1>Producto vacio</h1>
          <button className="btn-primary" onClick={() => navigate("/almacen")}>
            Volver al Almacen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-history-page">
      <div className="page-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div>
            <h1>📊 Historial de Entradas</h1>
            <p className="page-subtitle">{product.nombre_product}</p>
          </div>
          <button
            className="btn-back"
            onClick={() => navigate("/almacen")}
            title="Volver al almacen"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
        </div>
      </div>

      <div className="stock-history-content">
        {entries.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h2>Sin entradas registradas</h2>
            <p>Aun no hay entradas de stock para este producto</p>
          </div>
        ) : (
          <div className="sabores-sections">
            {Object.keys(groupedBySabor).map((saborNombre) => (
              <div key={saborNombre} className="sabor-section">
                <div className="sabor-section-header">
                  <h3>🍊 {saborNombre}</h3>
                  <span className="total-badge">
                    Total: {getTotalPorSabor(saborNombre)} cajas
                  </span>
                </div>

                <div className="entries-table">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Cantidad</th>
                        <th>Fecha de Entrada</th>
                        <th>Registrado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedBySabor[saborNombre].map((entry) => (
                        <tr key={entry.id}>
                          <td className="entry-id">#{entry.id}</td>
                          <td>
                            <strong
                              style={{ fontSize: "16px", color: "#3b82f6" }}
                            >
                              {entry.cantidad} cajas
                            </strong>
                          </td>
                          <td>
                            {format(new Date(entry.fecha_entrada), "PPP", {
                              locale: es,
                            })}
                          </td>
                          <td className="entry-time">
                            {format(new Date(entry.created_at), "PPpp", {
                              locale: es,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
