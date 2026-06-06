import { useEffect, useRef, useState } from "react";

// Unité publicitaire AdSense chargée à la demande : on n'injecte le bloc et on
// ne déclenche le remplissage que lorsqu'il approche du viewport (IntersectionObserver).
// Cela évite de charger des pubs hors écran et allège le rendu initial.
export default function AdUnit({ slot, format = "auto", style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { setVisible(true); io.disconnect(); }
    }, { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* AdSense indisponible */ }
  }, [visible]);

  return (
    <div ref={ref} style={{ textAlign: "center", overflow: "hidden", minHeight: 1, ...style }}>
      {visible && (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-1297423880558120"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
