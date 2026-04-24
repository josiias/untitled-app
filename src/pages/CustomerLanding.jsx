import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HERO_SLIDES = [
  { img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80", label: "Für Lokale Läden" },
  { img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=80", label: "Für Barbershops" },
  { img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1400&q=80", label: "Für Cafés" },
  { img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1400&q=80", label: "Für Nagelstudios" },
];

const CATEGORIES = [
  { label: "Cafés", emoji: "☕", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80" },
  { label: "Nagelstudios", emoji: "💅", img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80" },
  { label: "Massagestudios", emoji: "💆", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80" },
  { label: "Restaurants", emoji: "🍽️", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
  { label: "Friseursalons", emoji: "💇", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80" },
  { label: "Lokale Läden", emoji: "🏪", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80" },
  { label: "Barbershops", emoji: "✂️", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80" },
];

const HOW_STEPS = [
  {
    id: "qr",
    label: "QR-Code scannen",
    title: "Scan beim Besuch",
    content: (
      <div style={{ background: "#1a1a2e", borderRadius: 28, padding: 24, width: 220, margin: "0 auto", border: "2px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>9:41 ···</div>
        <div style={{ fontWeight: 800, color: "#fff", fontSize: 14, textAlign: "center", marginBottom: 16 }}>KINGS BARBERSHOP</div>
        <div style={{ background: "#fff", borderRadius: 12, padding: 12, margin: "0 auto", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #10B981" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 2, width: "100%", height: "100%" }}>
            {Array.from({length: 36}).map((_, i) => <div key={i} style={{ background: Math.random() > 0.4 ? "#111" : "transparent", borderRadius: 1 }} />)}
          </div>
        </div>
        <div style={{ color: "#10B981", fontWeight: 700, fontSize: 12, textAlign: "center", marginTop: 10 }}>✓ Erfolgreich gescannt!</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
          {[0,1,2,3].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === 0 ? "#10B981" : "rgba(255,255,255,0.2)" }} />)}
        </div>
      </div>
    )
  },
  {
    id: "stamp",
    label: "Stempel sammeln",
    title: "Stempel sammeln",
    content: (
      <div style={{ background: "#1a1a2e", borderRadius: 28, padding: 24, width: 220, margin: "0 auto", border: "2px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>9:41 ···</div>
        <div style={{ fontWeight: 800, color: "#fff", fontSize: 13, marginBottom: 12 }}>Meine Karten</div>
        {[
          { name: "Kings Barbershop", emoji: "✂️", stamps: 5, total: 8, color: "#10B981" },
          { name: "Café Milano", emoji: "☕", stamps: 3, total: 8, color: "#F59E0B" },
          { name: "Bella Nails", emoji: "💅", stamps: 7, total: 8, color: "#EC4899" },
        ].map(c => (
          <div key={c.name} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#fff", marginBottom: 4 }}>
              <span>{c.emoji} {c.name}</span><span style={{ color: c.color }}>{c.stamps}/{c.total}</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 100 }}>
              <div style={{ height: "100%", width: `${(c.stamps/c.total)*100}%`, background: c.color, borderRadius: 100 }} />
            </div>
          </div>
        ))}
      </div>
    )
  },
  {
    id: "reward",
    label: "Prämie kassieren",
    title: "Prämie einlösen",
    content: (
      <div style={{ background: "#1a1a2e", borderRadius: 28, padding: 24, width: 220, margin: "0 auto", border: "2px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>9:41 ···</div>
        <div style={{ fontWeight: 800, color: "#fff", fontSize: 13, marginBottom: 12 }}>Meine Prämien 🎁</div>
        <div style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 14, padding: 14, marginBottom: 10 }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>✂️</div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>10€ Gutschein</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 4 }}>Kings Barbershop</div>
          <div style={{ background: "#10B981", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, color: "#fff", marginTop: 10, textAlign: "center" }}>Jetzt einlösen →</div>
        </div>
      </div>
    )
  },
  {
    id: "earn",
    label: "Geld verdienen",
    title: "Provision verdienen",
    content: (
      <div style={{ background: "#1a1a2e", borderRadius: 28, padding: 24, width: 220, margin: "0 auto", border: "2px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>9:41 ···</div>
        <div style={{ fontWeight: 800, color: "#fff", fontSize: 13, marginBottom: 12 }}>Empfehlen & Verdienen</div>
        <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>DEIN CODE</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "#8B5CF6" }}>MAX2026</div>
        </div>
        <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: 10, marginBottom: 8 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Neue Empfehlung 🎉</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Sara hat dich verwendet!</div>
        </div>
        <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: 10 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>PROVISION ERHALTEN 💸</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#10B981" }}>+ 20,00 €</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>automatisch gutgeschrieben</div>
        </div>
      </div>
    )
  },
];

const MAP_MARKERS = [
  { pos: [52.52, 13.38], label: "Barbershop" },
  { pos: [52.505, 13.36], label: "Restaurant" },
  { pos: [52.535, 13.42], label: "Nagelstudio" },
  { pos: [52.515, 13.45], label: "Café" },
  { pos: [52.508, 13.40], label: "" },
];

export default function CustomerLanding() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [activeStep, setActiveStep] = useState("qr");

  useEffect(() => {
    const t = setInterval(() => setHeroSlide(i => (i + 1) % HERO_SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const step = HOW_STEPS.find(s => s.id === activeStep);

  return (
    <div style={{ minHeight: "100vh", background: "#080f0b", fontFamily: "'Inter', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .leaflet-container { border-radius: 20px; }
      `}</style>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,15,11,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>Sensalie<span style={{ color: "#10B981" }}>.</span></div>
        <Link to="/dashboard" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 100, padding: "8px 20px", fontSize: 13, fontWeight: 700, color: "#fff", textDecoration: "none" }}>
          Anmelden
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {HERO_SLIDES.map((s, i) => (
          <img key={s.img} src={s.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: i === heroSlide ? 0.45 : 0, transition: "opacity 1.5s ease" }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(5,10,8,0.92) 35%, rgba(5,10,8,0.5) 100%)" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", padding: "80px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "clamp(38px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 10px" }}>
              Sammel digitale <span style={{ color: "#10B981" }}>Stempelkarten</span>
            </h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40, marginTop: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>🎁</span>
                <div>
                  <div style={{ fontSize: "clamp(17px, 2.5vw, 22px)", fontWeight: 800 }}>Hol dir großartige Prämien</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Rabatte, Gratisleistungen & mehr</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>💸</span>
                <div>
                  <div style={{ fontSize: "clamp(17px, 2.5vw, 22px)", fontWeight: 800 }}>
                    Verdiene <span style={{ color: "#10B981" }}>100 €</span> und mehr
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Einfach durch Empfehlungen. Passiv. Automatisch.</div>
                </div>
              </div>
            </div>
            <Link to="/dashboard" style={{ display: "inline-block", background: "#10B981", color: "#fff", fontWeight: 800, fontSize: 16, padding: "16px 36px", borderRadius: 100, textDecoration: "none", boxShadow: "0 8px 30px rgba(16,185,129,0.4)" }}>
              Kostenlos registrieren
            </Link>
          </div>

          {/* Phone mockup with stamp dots */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ background: "#111827", borderRadius: 40, padding: "20px 16px", width: 240, border: "2px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 80px rgba(0,0,0,0.7)" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 14, textAlign: "center", letterSpacing: 1 }}>9:41 ···</div>
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 12, color: "#fff" }}>Meine Karten</div>
              {[
                { name: "Kings Barbershop", emoji: "✂️", stamps: 5, total: 8, color: "#10B981" },
                { name: "Café Milano", emoji: "☕", stamps: 3, total: 8, color: "#F59E0B" },
                { name: "Bella Nails", emoji: "💅", stamps: 7, total: 8, color: "#EC4899" },
              ].map(c => (
                <div key={c.name} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#fff", marginBottom: 8 }}>
                    <span style={{ fontWeight: 700 }}>{c.emoji} {c.name}</span>
                    <span style={{ color: c.color, fontWeight: 700, fontSize: 10 }}>{c.stamps}/{c.total}</span>
                  </div>
                  {/* Stamp dots */}
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {Array.from({ length: c.total }).map((_, i) => (
                      <div key={i} style={{
                        width: 16, height: 16, borderRadius: "50%",
                        background: i < c.stamps ? c.color : "rgba(255,255,255,0.1)",
                        border: i < c.stamps ? "none" : "1px solid rgba(255,255,255,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 8, color: "#fff",
                        boxShadow: i === c.stamps - 1 ? `0 0 8px ${c.color}88` : "none",
                      }}>
                        {i < c.stamps ? "✓" : ""}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "10px 12px", marginTop: 4 }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>💸 Verdient</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#10B981" }}>42,50 €</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>3 Empfehlungen</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>ENTDECKEN ↓</div>
      </div>

      {/* Features */}
      <div style={{ background: "#080f0b", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>DAS MACHT SENSALIE FÜR DICH</div>
          <h2 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, margin: "0 0 50px" }}>Mehr Wert aus jedem Besuch</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {[
              { emoji: "🎁", title: "Prämien sammeln", desc: "Mit jedem Einkauf näher zur nächsten Belohnung" },
              { emoji: "🌸", title: "Geld verdienen", desc: "Empfehle Freunde und verdiene automatisch Provisionen" },
              { emoji: "📱", title: "Jederzeit dabei", desc: "Digitale Karten überall — ohne Papier, ohne Gedöns" },
              { emoji: "🤝", title: "Fair für alle", desc: "Deine Daten, deine Kontrolle — transparent und sicher" },
            ].map(f => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>{f.emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partner Categories */}
      <div style={{ padding: "60px 0", background: "#060d09" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase" }}>PARTNER-KATEGORIEN</div>
        </div>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", padding: "0 24px", scrollbarWidth: "none" }}>
          {CATEGORIES.map(cat => (
            <div key={cat.label} style={{ position: "relative", width: 150, height: 180, borderRadius: 20, overflow: "hidden", flexShrink: 0 }}>
              <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: 14, left: 12, right: 12 }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{cat.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{cat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: "80px 24px", background: "#080f0b" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>SO FUNKTIONIERT'S</div>
            <h2 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, margin: "0 0 10px" }}>Sieh's live in Aktion</h2>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Tippe auf einen Schritt oder schau einfach zu.</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
            {HOW_STEPS.map(s => (
              <button key={s.id} onClick={() => setActiveStep(s.id)}
                style={{ padding: "10px 20px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, background: activeStep === s.id ? "#10B981" : "rgba(255,255,255,0.08)", color: activeStep === s.id ? "#fff" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}>
                {s.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>{step?.content}</div>
        </div>
      </div>

      {/* Map */}
      <div style={{ padding: "80px 24px", background: "#060d09" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>BALD VERFÜGBAR</div>
            <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, margin: "0 0 10px" }}>Entdecke Partner in deiner Nähe</h2>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Lokale Geschäfte auf der Karte — einfach vorbeikommen, scannen, sammeln.</div>
          </div>
          <div style={{ borderRadius: 20, overflow: "hidden", height: 300, position: "relative" }}>
            <MapContainer center={[52.52, 13.40]} zoom={12} style={{ height: "100%", width: "100%" }} zoomControl={true}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              {MAP_MARKERS.map((m, i) => (
                <Marker key={i} position={m.pos}>
                  {m.label && <Popup>{m.label}</Popup>}
                </Marker>
              ))}
            </MapContainer>
            <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", background: "#10B981", borderRadius: 100, padding: "8px 18px", fontSize: 12, fontWeight: 700, color: "#fff", zIndex: 1000, whiteSpace: "nowrap" }}>
              📍 Demnächst in deiner Stadt
            </div>
          </div>
        </div>
      </div>

      {/* Vision */}
      <div style={{ padding: "80px 24px", background: "#080f0b" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ background: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80') center/cover", borderRadius: 24, padding: "48px 36px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(8,15,11,0.7)", borderRadius: 24 }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>UNSERE VISION</div>
              <h2 style={{ fontSize: "clamp(20px,4vw,32px)", fontWeight: 900, lineHeight: 1.3, maxWidth: 700 }}>
                Jeder Einkauf soll sich lohnen. Nicht nur für das Geschäft — sondern für dich.
              </h2>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.8, marginTop: 16, maxWidth: 600 }}>
                Sensalie verbindet lokale Unternehmen mit ihren treuesten Kunden — digital, fair und ohne Papierkram. Du wirst belohnt für das, was du eh schon tust.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "80px 24px", background: "#060d09", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 900, margin: "0 0 16px" }}>
          Bereit für mehr<br />aus jedem Besuch?
        </h2>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, marginBottom: 36 }}>
          Kostenlos starten. Kein Abo. Keine versteckten Kosten.
        </div>
        <Link to="/dashboard" style={{ display: "inline-block", background: "#10B981", color: "#fff", fontWeight: 800, fontSize: 16, padding: "18px 44px", borderRadius: 100, textDecoration: "none", boxShadow: "0 8px 30px rgba(16,185,129,0.4)" }}>
          Jetzt kostenlos registrieren
        </Link>
      </div>
    </div>
  );
}