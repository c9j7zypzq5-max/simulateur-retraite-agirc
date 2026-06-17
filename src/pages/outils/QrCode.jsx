import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import { track } from "@vercel/analytics";
import { useTheme } from "../../hooks/useTheme.js";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import JsonLd from "../../components/JsonLd.jsx";
import AdUnit from "../../components/AdUnit.jsx";
import { SimulateurHeader } from "../../components/ui.jsx";

const PRESETS = [
  { label: "Classique", fg: "#0a1628", bg: "#ffffff" },
  { label: "Or",        fg: "#7a5c1e", bg: "#fffdf6" },
  { label: "Océan",     fg: "#0b3d63", bg: "#eef6fb" },
  { label: "Forêt",     fg: "#14532d", bg: "#f0faf3" },
  { label: "Nuit",      fg: "#e8e8ef", bg: "#0b1020" },
  { label: "Corail",    fg: "#7c2d12", bg: "#fff4ed" },
];

const DOT_STYLES = [
  { value: "square",  label: "Carré" },
  { value: "rounded", label: "Arrondi" },
  { value: "dots",    label: "Ronds" },
];

const FAQ = [
  { q: "Le QR code est-il gratuit et sans expiration ?", a: "Oui. Le QR code est généré localement dans votre navigateur, il est statique (il pointe directement vers votre texte ou lien) et ne dépend d'aucun serveur. Il fonctionnera indéfiniment, sans abonnement ni suivi." },
  { q: "Puis-je mettre mon logo au centre ?", a: "Oui. Ajoutez une image (PNG, JPG, SVG) ou un emoji au centre. Le générateur active automatiquement le niveau de correction d'erreurs le plus élevé (H) pour que le QR code reste lisible malgré le logo, qui peut masquer jusqu'à environ 30 % du code." },
  { q: "Mes données sont-elles envoyées sur un serveur ?", a: "Non. Tout est calculé dans votre navigateur : le texte, les couleurs et l'image ne quittent jamais votre appareil. Aucune donnée n'est téléversée." },
  { q: "Quel format de téléchargement choisir ?", a: "Le PNG convient pour le web, les réseaux sociaux et la plupart des impressions. Choisissez une taille élevée (1000 px ou plus) pour une impression nette en grand format." },
  { q: "Pourquoi mon QR code ne se scanne pas ?", a: "Vérifiez le contraste : la couleur du motif doit être nettement plus sombre que le fond. Évitez un logo trop grand, et gardez une marge blanche autour du code. Testez toujours avec l'appareil photo de votre téléphone avant de l'imprimer." },
];

// Dessine le QR code manuellement depuis la matrice qrcode.create(),
// ce qui permet des formes de modules personnalisées (carré, arrondi, ronds).
function drawQR({ canvas, value, size, margin, fg, bg, dotStyle, hasLogo, logoType, logoPct, emoji, imgEl }) {
  let qr;
  try {
    qr = QRCode.create(value, { errorCorrectionLevel: hasLogo ? "H" : "M" });
  } catch {
    return false;
  }

  canvas.width  = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const n = qr.modules.size;
  const ppm = size / (n + 2 * margin); // pixels per module
  const off = margin * ppm;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = fg;
  const data = qr.modules.data;
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (!data[row * n + col]) continue;
      const x = off + col * ppm;
      const y = off + row * ppm;
      if (dotStyle === "dots") {
        ctx.beginPath();
        ctx.arc(x + ppm / 2, y + ppm / 2, ppm * 0.42, 0, Math.PI * 2);
        ctx.fill();
      } else if (dotStyle === "rounded") {
        roundRect(ctx, x, y, ppm, ppm, ppm * 0.35);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, ppm, ppm);
      }
    }
  }

  if (hasLogo) {
    const box = Math.round(size * (logoPct / 100));
    const cx = size / 2, cy = size / 2;
    const pad = Math.round(box * 0.07); // marge réduite autour du logo
    const r   = (box + pad * 2) / 2;

    ctx.save();
    ctx.fillStyle = bg;
    roundRect(ctx, cx - r, cy - r, r * 2, r * 2, Math.round(r * 0.28));
    ctx.fill();
    ctx.restore();

    if (logoType === "image" && imgEl) {
      const ratio = Math.min(box / imgEl.width, box / imgEl.height);
      const w = imgEl.width * ratio, h = imgEl.height * ratio;
      ctx.drawImage(imgEl, cx - w / 2, cy - h / 2, w, h);
    } else if (logoType === "emoji" && emoji) {
      ctx.font = `${box}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji, cx, cy + box * 0.06);
    }
  }

  return true;
}

export default function QrCode() {
  const [theme, setTheme] = useTheme();

  const [text, setText]       = useState("https://www.simfinly.com");
  const [fg, setFg]           = useState("#0a1628");
  const [bg, setBg]           = useState("#ffffff");
  const [size, setSize]       = useState(1000);
  const [margin, setMargin]   = useState(2);
  const [dotStyle, setDotStyle] = useState("square");
  const [logoType, setLogoType] = useState("none");   // none | emoji | image
  const [emoji, setEmoji]     = useState("⭐");
  const [logoPct, setLogoPct] = useState(22);
  const [imgSrc, setImgSrc]   = useState(null);
  const [error, setError]     = useState("");

  const canvasRef = useRef(null);
  const imgElRef  = useRef(null);

  useEffect(() => {
    document.title = "Générateur de QR code personnalisé — couleur, logo, texte | Simfinly.com";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Créez un QR code gratuit et personnalisé : couleurs au choix, texte ou lien libre, logo ou emoji au centre. Téléchargement PNG haute résolution, sans inscription.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.simfinly.com/outils/qr-code';
    track('simulator_view', { name: 'qr-code' });
  }, []);

  const onPickImage = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => { imgElRef.current = img; setImgSrc(reader.result); setLogoType("image"); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const value = text.trim();
    if (!value) { setError("Saisissez un texte ou un lien."); return; }

    const hasLogo = (logoType === "emoji" && emoji) || (logoType === "image" && imgElRef.current);
    const ok = drawQR({
      canvas, value, size, margin, fg, bg, dotStyle,
      hasLogo, logoType, logoPct, emoji, imgEl: imgElRef.current,
    });
    if (!ok) setError("Texte trop long pour un QR code. Raccourcissez-le.");
    else setError("");
  }, [text, fg, bg, size, margin, dotStyle, logoType, emoji, logoPct, imgSrc]);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "qr-code-simfinly.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
    track('qr_download', { logo: logoType });
  }, [logoType]);

  const field = { background: "var(--input-bg)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans', sans-serif", padding: "10px 12px", width: "100%" };
  const labelStyle = { display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 7, fontWeight: 500 };
  const card = { background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "24px", marginBottom: 20, boxShadow: "var(--card-shadow)" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif", color: "var(--text)" }}>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": "Générateur de QR code personnalisé",
        "url": "https://www.simfinly.com/outils/qr-code",
        "description": "Créez un QR code gratuit et personnalisé : couleurs, texte ou lien libre, logo ou emoji au centre. Téléchargement PNG haute résolution.",
        "applicationCategory": "UtilitiesApplication", "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "EUR" },
        "inLanguage": "fr-FR",
      }} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": FAQ.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })),
      }} />
      <Navbar theme={theme} setTheme={setTheme} />

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 16px 60px" }}>
        <SimulateurHeader
          icon={<span style={{ fontSize: 30 }}>🔳</span>}
          badge="Outils · Gratuit"
          title="Générateur de QR code"
          desc="Créez un QR code personnalisé : vos couleurs, le texte ou le lien de votre choix, et votre logo ou un emoji au centre. Téléchargement PNG haute résolution, 100 % gratuit et sans inscription."
        />

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,360px)", gap: 20, alignItems: "start" }} className="qr-layout">
          {/* ── Paramètres ── */}
          <div>
            <div style={card}>
              <label style={labelStyle} htmlFor="qr-text">Texte ou lien (URL)</label>
              <textarea id="qr-text" value={text} onChange={e => setText(e.target.value)} rows={3}
                placeholder="https://exemple.com ou n'importe quel texte"
                style={{ ...field, resize: "vertical", marginBottom: 18 }} />

              <div style={{ marginBottom: 18 }}>
                <span style={labelStyle}>Palettes</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PRESETS.map(p => (
                    <button key={p.label} onClick={() => { setFg(p.fg); setBg(p.bg); }}
                      title={p.label}
                      style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 10px", borderRadius: 9, cursor: "pointer",
                        background: "var(--input-bg)", border: `1px solid ${fg === p.fg && bg === p.bg ? "var(--border-gold)" : "var(--border)"}`, color: "var(--text)", fontSize: 12 }}>
                      <span style={{ width: 14, height: 14, borderRadius: 4, background: p.fg, border: `2px solid ${p.bg}`, boxShadow: "0 0 0 1px var(--border)" }} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 16, marginBottom: 18 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle} htmlFor="qr-fg">Couleur du motif</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input id="qr-fg" type="color" value={fg} onChange={e => setFg(e.target.value)} style={{ width: 42, height: 38, border: "1px solid var(--border)", borderRadius: 8, background: "none", cursor: "pointer", padding: 2 }} />
                    <input value={fg} onChange={e => setFg(e.target.value)} style={{ ...field, fontFamily: "monospace" }} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle} htmlFor="qr-bg">Couleur de fond</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input id="qr-bg" type="color" value={bg} onChange={e => setBg(e.target.value)} style={{ width: 42, height: 38, border: "1px solid var(--border)", borderRadius: 8, background: "none", cursor: "pointer", padding: 2 }} />
                    <input value={bg} onChange={e => setBg(e.target.value)} style={{ ...field, fontFamily: "monospace" }} />
                  </div>
                </div>
              </div>

              <div>
                <span style={labelStyle}>Forme des modules</span>
                <div style={{ display: "flex", gap: 8 }}>
                  {DOT_STYLES.map(({ value: v, label }) => (
                    <button key={v} onClick={() => setDotStyle(v)}
                      style={{ flex: 1, padding: "9px 8px", borderRadius: 9, cursor: "pointer", fontSize: 13,
                        background: dotStyle === v ? "rgba(184,147,74,0.12)" : "var(--input-bg)",
                        border: `1px solid ${dotStyle === v ? "var(--border-gold)" : "var(--border)"}`,
                        color: dotStyle === v ? "var(--gold)" : "var(--text)" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Logo central */}
            <div style={card}>
              <span style={{ ...labelStyle, fontSize: 14, color: "var(--text)", fontWeight: 600, marginBottom: 12 }}>Logo central (optionnel)</span>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {[["none", "Aucun"], ["emoji", "Emoji"], ["image", "Image"]].map(([v, l]) => (
                  <button key={v} onClick={() => setLogoType(v)}
                    style={{ flex: 1, padding: "9px 8px", borderRadius: 9, cursor: "pointer", fontSize: 13,
                      background: logoType === v ? "rgba(184,147,74,0.12)" : "var(--input-bg)",
                      border: `1px solid ${logoType === v ? "var(--border-gold)" : "var(--border)"}`,
                      color: logoType === v ? "var(--gold)" : "var(--text)" }}>
                    {l}
                  </button>
                ))}
              </div>

              {logoType === "emoji" && (
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle} htmlFor="qr-emoji">Emoji ou caractère</label>
                  <input id="qr-emoji" value={emoji} onChange={e => setEmoji(e.target.value.slice(0, 2))} maxLength={2}
                    style={{ ...field, fontSize: 22, textAlign: "center", width: 80 }} />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                    {["⭐","❤️","🔥","✅","📍","🎁","💼","🌐","📷","🎵","🍕","🏠"].map(e => (
                      <button key={e} onClick={() => setEmoji(e)} style={{ fontSize: 18, padding: "4px 7px", borderRadius: 8, cursor: "pointer", background: "var(--input-bg)", border: "1px solid var(--border)" }}>{e}</button>
                    ))}
                  </div>
                </div>
              )}

              {logoType === "image" && (
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle} htmlFor="qr-img">Votre image (PNG, JPG, SVG)</label>
                  <input id="qr-img" type="file" accept="image/*" onChange={e => onPickImage(e.target.files?.[0])}
                    style={{ ...field, padding: "8px 10px" }} />
                  {imgSrc && <div style={{ marginTop: 8, fontSize: 12, color: "var(--text-secondary)" }}>Image chargée ✓</div>}
                </div>
              )}

              {logoType !== "none" && (
                <div>
                  <label style={labelStyle} htmlFor="qr-logopct">Taille du logo : {logoPct} %</label>
                  <input id="qr-logopct" type="range" min={10} max={32} value={logoPct} onChange={e => setLogoPct(+e.target.value)} style={{ width: "100%", accentColor: "var(--gold)" }} />
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4 }}>Au-delà de ~30 %, le QR code peut devenir illisible.</div>
                </div>
              )}
            </div>

            {/* Taille & marge */}
            <div style={card}>
              <label style={labelStyle} htmlFor="qr-size">Résolution : {size} px</label>
              <input id="qr-size" type="range" min={256} max={2000} step={8} value={size} onChange={e => setSize(+e.target.value)} style={{ width: "100%", accentColor: "var(--gold)", marginBottom: 18 }} />
              <label style={labelStyle} htmlFor="qr-margin">Marge (silence) : {margin} modules</label>
              <input id="qr-margin" type="range" min={0} max={8} value={margin} onChange={e => setMargin(+e.target.value)} style={{ width: "100%", accentColor: "var(--gold)" }} />
            </div>
          </div>

          {/* ── Aperçu ── */}
          <div style={{ position: "sticky", top: 72 }}>
            <div style={{ ...card, textAlign: "center" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-secondary)", marginBottom: 14 }}>Aperçu</div>
              <div style={{ display: "inline-block", padding: 12, borderRadius: 14, background: "var(--input-bg)", border: "1px solid var(--border)", width: "100%", maxWidth: 284, boxSizing: "border-box" }}>
                <canvas ref={canvasRef} style={{ width: "100%", aspectRatio: "1 / 1", display: "block", borderRadius: 6 }} />
              </div>
              {error && <div style={{ marginTop: 12, fontSize: 12, color: "#ef4444" }}>{error}</div>}
              <button onClick={download} disabled={!!error}
                style={{ width: "100%", marginTop: 16, padding: "13px 20px", borderRadius: 12, cursor: error ? "not-allowed" : "pointer",
                  background: error ? "var(--input-bg)" : "linear-gradient(135deg,var(--gold),var(--gold-mid))",
                  color: error ? "var(--text-secondary)" : "#1a1206", border: "none", fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                ⬇ Télécharger en PNG
              </button>
              <div style={{ marginTop: 10, fontSize: 11, color: "var(--text-secondary)" }}>Généré dans votre navigateur · aucune donnée envoyée</div>
            </div>
          </div>
        </div>

        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>

        {/* À propos */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>À propos de ce générateur</h2>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>Un QR code (Quick Response code) est un code-barres en deux dimensions qui encode du texte — le plus souvent une adresse web — lisible instantanément par l'appareil photo d'un smartphone. Ce générateur crée des QR codes <strong style={{ color: "var(--text)" }}>statiques</strong> : l'information est inscrite directement dans le motif, sans redirection ni serveur intermédiaire. Le code reste donc valable indéfiniment et ne peut pas être désactivé par un tiers.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Personnalisation et lisibilité</h3>
            <p style={{ marginBottom: 16 }}>Vous pouvez choisir librement les couleurs, à condition de conserver un fort contraste entre le motif et le fond (un motif sombre sur fond clair fonctionne toujours mieux). L'ajout d'un logo ou d'un emoji au centre active automatiquement le niveau de correction d'erreurs maximal : la norme QR permet de reconstituer jusqu'à environ 30 % d'un code masqué ou abîmé, ce qui autorise un logo central sans empêcher la lecture.</p>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: "var(--text)", marginTop: 20, marginBottom: 10 }}>Confidentialité</h3>
            <p>Tout est calculé localement dans votre navigateur. Le texte, les couleurs et l'image que vous ajoutez ne sont jamais téléversés : aucune donnée ne quitte votre appareil, et aucun suivi n'est associé au QR code généré.</p>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: 20, padding: "36px 28px", marginTop: 20 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px,4vw,26px)", fontWeight: 600, color: "var(--text)", marginBottom: 24 }}>Questions fréquentes</h2>
          {FAQ.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
        </div>

        <div style={{ margin: "24px 0" }}><AdUnit slot="auto" format="auto" /></div>
      </div>
      <Footer />
    </div>
  );
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, background: "none", border: "none", cursor: "pointer", padding: "18px 0", textAlign: "left" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: "var(--text)", lineHeight: 1.4 }}>{q}</span>
        <span aria-hidden="true" style={{ flexShrink: 0, fontSize: 18, color: open ? "var(--gold)" : "var(--text-secondary)" }}>{open ? "−" : "+"}</span>
      </button>
      {open && <p style={{ paddingBottom: 18, paddingRight: 32, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>{a}</p>}
    </div>
  );
}
