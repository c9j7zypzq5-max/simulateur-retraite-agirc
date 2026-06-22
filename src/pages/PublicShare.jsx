import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PublicShare() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) { navigate("/", { replace: true }); return; }

    fetch(`/api/share?action=get&id=${encodeURIComponent(id)}`)
      .then(r => r.json())
      .then(data => {
        if (data.params) {
          // Redirige vers le simulateur avec les paramètres encodés
          const dest = data.params.startsWith("http")
            ? new URL(data.params).pathname + new URL(data.params).search
            : data.params;
          navigate(dest, { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      })
      .catch(() => navigate("/", { replace: true }));
  }, [id, navigate]);

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)", display: "flex",
      alignItems: "center", justifyContent: "center", flexDirection: "column",
      gap: 16, fontFamily: "'Hanken Grotesk', sans-serif", color: "var(--text-secondary)",
    }}>
      <div style={{ fontSize: 32 }}>⏳</div>
      <div style={{ fontSize: 14 }}>Chargement de la simulation…</div>
    </div>
  );
}
