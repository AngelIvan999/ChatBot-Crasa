import { useState, useRef, useEffect } from "react";

export default function SaboresPopover({ saboresData, productoNombre }) {
  const [showPopover, setShowPopover] = useState(false);
  const containerRef = useRef(null);
  const popoverRef = useRef(null);

  const saboresArray = Object.values(saboresData);
  const totalSabores = saboresArray.length;

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowPopover(false);
      }
    }

    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover]);

  // Ajustar posición del popover despues de renderizar
  useEffect(() => {
    if (showPopover && popoverRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();

      // Posición por defecto: debajo del trigger
      let top = containerRect.bottom + 8;
      let left = containerRect.left;

      //Si se sale por abajo, mostrarlo arriba
      if (top + popoverRect.height > window.innerHeight - 20) {
        top = containerRect.top - popoverRect.height - 8;
      }

      // Si se sale por la derecha, ajustar a la izquierda
      if (left + popoverRect.width > window.innerWidth - 20) {
        left = window.innerWidth - popoverRect.width - 20;
      }

      // Si se sale por la izquierda
      if (left < 20) {
        left = 20;
      }

      popoverRef.current.style.top = `${top}px`;
      popoverRef.current.style.left = `${left}px`;
    }
  }, [showPopover]);

  return (
    <div className="sabores-popover-container" ref={containerRef}>
      <div
        className="sabores-trigger"
        onClick={() => setShowPopover(!showPopover)}
        title="Ver sabores disponibles"
      >
        <span className="sabores-icon">🍊</span>
        <span className="sabores-count">{totalSabores}</span>
      </div>

      {showPopover && (
        <div ref={popoverRef} className="sabores-popover-box">
          <div className="sabores-popover-header">
            <div className="popover-title">
              <span>🍊</span>
              <strong>{productoNombre}</strong>
            </div>
            <button
              className="popover-close-btn"
              onClick={() => setShowPopover(false)}
              title="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="sabores-popover-list">
            {saboresArray.map((sabor, idx) => (
              <div key={idx} className="sabor-popover-item">
                <div className="sabor-info">
                  <span className="sabor-nombre">{sabor.nombre}</span>
                  <span
                    className={`sabor-status ${
                      sabor.stock === 0
                        ? "status-agotado"
                        : sabor.stock < 20
                        ? "status-bajo"
                        : "status-ok"
                    }`}
                  >
                    {sabor.stock === 0
                      ? "Agotado"
                      : sabor.stock < 20
                      ? "Stock Bajo"
                      : "Disponible"}
                  </span>
                </div>
                <div className="sabor-stats">
                  <span className="sabor-stock">
                    📦 <strong>{sabor.stock}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
