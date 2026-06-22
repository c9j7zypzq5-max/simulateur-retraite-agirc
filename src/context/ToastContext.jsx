import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((msg, type = "success") => {
    const id = ++idRef.current;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        zIndex: 9999, pointerEvents: "none",
      }}>
        {toasts.map(({ id, msg, type }) => (
          <div key={id} style={{
            padding: "10px 20px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Hanken Grotesk', sans-serif",
            color: type === "error" ? "#fff" : "#1a1000",
            background: type === "error" ? "#c0392b" : "var(--gold, #b8934a)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            animation: "toastIn 0.2s ease",
            whiteSpace: "nowrap",
          }}>
            {msg}
          </div>
        ))}
      </div>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext) || (() => {});
}
