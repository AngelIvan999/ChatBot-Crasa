import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getStockEntriesByProduct } from "../../services/almacenService";

export default function StockHistoryModal({ product, onClose }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedBySabor, setGroupedBySabor] = useState({});

  useEffect(() => {
    loadEntries();
  }, [product.id]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const data = await getStockEntriesByProduct(product.id);
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
      <div className="stock-history-modal">
        <h2>📊 Historial de Entradas - {product.nombre_product}</h2>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-history-modal">
      <h2>📊 Historial de Entradas</h2>
      <div className="product-info-header">
        <h3>{product.nombre_product}</h3>
        <div className="product-stats">
          <span>📦 {entries.length} entradas registradas</span>
          <span>💰 ${parseFloat(product.prc_menudeo).toFixed(2)}</span>
          <span>📦 {product.cant_paquete} pzs/caja</span>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>Sin entradas registradas</h3>
          <p>Aun no hay entradas de stock para este producto</p>
        </div>
      ) : (
        <div className="sabores-sections">
          {Object.keys(groupedBySabor).map((saborNombre) => (
            <div key={saborNombre} className="sabor-section">
              <div className="sabor-section-header">
                <h4>🍊 {saborNombre}</h4>
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
  );
}
