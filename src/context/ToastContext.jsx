import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  // duration: number (ms) | 'persist' — persistent toasts must be closed manually.
  const showToast = useCallback((msg, type = "success", { duration = 3000 } = {}) => {
    const id = ++idRef.current;
    setToasts(t => [...t, { id, msg, type, persist: duration === 'persist' }]);
    if (duration !== 'persist') {
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
    }
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          zIndex: 9999,
        }}>
        {toasts.map(({ id, msg, type, persist }) => (
          <div key={id} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: persist ? "10px 14px 10px 20px" : "10px 20px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Hanken Grotesk', sans-serif",
            color: type === "error" ? "#fff" : "#1a1000",
            background: type === "error" ? "#c0392b" : "var(--gold, #b8934a)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            animation: "toastIn 0.2s ease",
            whiteSpace: "nowrap",
            pointerEvents: persist ? "auto" : "none",
          }}>
            <span>{msg}</span>
            {persist && (
              <button
                onClick={() => dismissToast(id)}
                aria-label="Fermer"
                style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: "2px 4px", opacity: 0.7, fontSize: 16, lineHeight: 1 }}
              >×</button>
            )}
          </div>
        ))}
      </div>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </ToastContext.Provider>
  );
}

// Returns the showToast function directly for backwards compatibility.
// showToast(msg, type?, { duration? }) — duration: number ms | 'persist'
export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx?.showToast || (() => {});
}
