import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const HERO_SLIDES = [
  { img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=80", label: "Barbershops" },
  { img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1400&q=80", label: "Cafés" },
  { img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1400&q=80", label: "Nagelstudios" },
  { img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1400&q=80", label: "Massagestudios" },
  { img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=80", label: "Friseursalons" },
];

const CATEGORIES = [
  { label: "Cafés", emoji: "☕", img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80" },
  { label: "Nagelstudios", emoji: "💅", img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80" },
  { label: "Barbershops", emoji: "✂️", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80" },
  { label: "Massage", emoji: "💆", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80" },
  { label: "Friseur", emoji: "💇", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80" },
  { label: "Restaurant", emoji: "🍽️", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
  { label: "Lokale Läden", emoji: "🏪", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80" },
  { label: "Beauty", emoji: "💄", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80" },
];

const STAMP_CARDS = [
  { name: "Kings Barbershop", emoji: "✂️", stamps: 5, total: 8, color: "#10B981", appointment: "Mo, 28. Apr · 14:00" },
  { name: "Café Milano", emoji: "☕", stamps: 3, total: 6, color: "#F59E0B", appointment: null },
  { name: "Bella Nails", emoji: "💅", stamps: 7, total: 8, color: "#EC4899", appointment: "Do, 01. Mai · 11:30" },
];

// Berlin map pins with realistic coordinates
const MAP_PINS = [
  { x: 38, y: 42, label: "Kings Barbershop", emoji: "✂️", color: "#10B981" },
  { x: 52, y: 30, label: "Café Milano", emoji: "☕", color: "#F59E0B" },
  { x: 65, y: 55, label: "Bella Nails", emoji: "💅", color: "#EC4899" },
  { x: 30, y: 62, label: "Sushi Lounge", emoji: "🍱", color: "#06B6D4" },
  { x: 72, y: 38, label: "Lotus Massage", emoji: "💆", color: "#8B5CF6" },
];

const HOW_STEPS = [
  { emoji: "📱", num: "01", title: "QR-Code scannen", desc: "Beim nächsten Besuch einfach den QR-Code an der Kasse scannen — kein Aufwand, keine Registrierung vor Ort.", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" },
  { emoji: "⭐", num: "02", title: "Stempel sammeln", desc: "Mit jedem Einkauf einen Stempel. Bald hast du deine Belohnung verdient.", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80" },
  { emoji: "🎁", num: "03", title: "Prämie einlösen", desc: "Wenn die Karte voll ist, löse deine Prämie direkt beim nächsten Besuch ein.", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80" },
  { emoji: "💸", num: "04", title: "Geld verdienen", desc: "Empfehle Freunde und kassiere automatisch Provision — passiv und ohne Aufwand.", img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80" },
];

// ── Phone Mockup ──────────────────────────────────────────────────────────────
function PhoneMockup() {
  const [activeCard, setActiveCard] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveCard(i => (i + 1) % STAMP_CARDS.length), 2500);
    return () => clearInterval(t);
  }, []);
  const c = STAMP_CARDS[activeCard];
  return (
    <div style={{
      background: "linear-gradient(160deg, #1a2530, #111e28)",
      borderRadius: 40, padding: "22px 16px 26px",
      width: 230, border: "1.5px solid rgba(255,255,255,0.14)",
      boxShadow: "0 50px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), 0 0 60px rgba(16,185,129,0.08)",
      margin: "0 auto", position: "relative",
    }}>
      <div style={{ width: 60, height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 100, margin: "0 auto 16px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px", marginBottom: 14 }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>9:41</span>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>●●● ▌</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Meine Karten</div>
        <div style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 100, padding: "3px 8px", fontSize: 9, fontWeight: 700, color: "#10B981" }}>3 aktiv</div>
      </div>
      <div style={{
        background: `linear-gradient(135deg, ${c.color}18, ${c.color}08)`,
        border: `1.5px solid ${c.color}40`,
        borderRadius: 18, padding: "14px 14px",
        marginBottom: 10, transition: "all 0.5s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 18 }}>{c.emoji}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{c.name}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Stempelkarte</div>
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 800, color: c.color }}>{c.stamps}/{c.total}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4 }}>
          {Array.from({ length: Math.min(c.total, 8) }).map((_, i) => (
            <div key={i} style={{
              width: 18, height: 18, borderRadius: "50%",
              background: i < c.stamps ? c.color : "rgba(255,255,255,0.08)",
              border: i < c.stamps ? "none" : "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 8, color: "#fff", fontWeight: 800,
              boxShadow: i === c.stamps - 1 ? `0 0 10px ${c.color}aa` : "none",
              transition: "all 0.4s",
            }}>
              {i < c.stamps ? "✓" : ""}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, background: c.color, borderRadius: 8, padding: "5px 10px", fontSize: 9, fontWeight: 800, color: "#fff", textAlign: "center" }}>
          🎁 Prämie: {c.total - c.stamps > 0 ? `noch ${c.total - c.stamps} Stempel` : "Einlösbar!"}
        </div>
      </div>
      {STAMP_CARDS.filter((_, i) => i !== activeCard).map(card => (
        <div key={card.name} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "9px 12px", marginBottom: 7, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{card.emoji} {card.name}</span>
          <span style={{ fontSize: 10, color: card.color, fontWeight: 700 }}>{card.stamps}/{card.total}</span>
        </div>
      ))}
      {STAMP_CARDS.filter(c => c.appointment)[0] && (
        <div style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)", borderRadius: 12, padding: "8px 12px", marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13 }}>📅</span>
          <div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>Nächster Termin</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{STAMP_CARDS.filter(c => c.appointment)[0].name}</div>
            <div style={{ fontSize: 9, color: "#EC4899", fontWeight: 600 }}>{STAMP_CARDS.filter(c => c.appointment)[0].appointment}</div>
          </div>
        </div>
      )}
      <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 14, padding: "10px 12px", marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>💸 Provision verdient</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#10B981" }}>42,50 €</div>
        </div>
        <div style={{ fontSize: 20 }}>🤑</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 14 }}>
        {STAMP_CARDS.map((_, i) => (
          <div key={i} onClick={() => setActiveCard(i)} style={{ width: i === activeCard ? 16 : 5, height: 5, borderRadius: 100, background: i === activeCard ? "#10B981" : "rgba(255,255,255,0.2)", transition: "all 0.3s", cursor: "pointer" }} />
        ))}
      </div>
    </div>
  );
}

// ── Features Section ──────────────────────────────────────────────────────────
function FeaturesSection() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const features = [
    { emoji: "🎫", title: "Digitale Stempelkarten", desc: "Sammel bei Barbershops, Cafés, Nagelstudios & Co. — alles auf einem Blick, immer dabei.", color: "#10B981", img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80" },
    { emoji: "💸", title: "100 € + verdienen", desc: "Empfehle deine Lieblingsgeschäfte an Freunde und kassiere automatisch Provision.", color: "#F59E0B", img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&q=80" },
    { emoji: "📅", title: "Termine verwalten", desc: "Buche und verwalte Termine bei deinen Partnerbetrieben direkt über Sensalie.", color: "#EC4899", img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80" },
    { emoji: "⚡", title: "Alles an einem Ort", desc: "Stempelkarten, Prämien, Termine und Provision — alles digital, alles übersichtlich.", color: "#8B5CF6", img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80" },
  ];

  return (
    <div ref={ref} style={{ padding: "70px 20px", background: "linear-gradient(180deg, #0d1f14 0%, #0a1a10 100%)", position: "relative" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>DEIN MEHRWERT</div>
          <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, margin: "0 0 8px" }}>Warum Sensalie?</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>Mehr als eine Stempelkarte.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 14 }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                borderRadius: 22, overflow: "hidden",
                border: hovered === i ? `1.5px solid ${f.color}66` : "1px solid rgba(255,255,255,0.1)",
                position: "relative",
                boxShadow: hovered === i ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${f.color}22` : "0 8px 32px rgba(0,0,0,0.3)",
                transform: hovered === i ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
                transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                cursor: "pointer",
                opacity: visible ? 1 : 0,
                transitionDelay: visible ? `${i * 0.08}s` : "0s",
              }}>
              <div style={{ height: 130, position: "relative", overflow: "hidden" }}>
                <img src={f.img} alt={f.title} style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transform: hovered === i ? "scale(1.08)" : "scale(1)",
                  transition: "transform 0.5s ease",
                }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)` }} />
                <div style={{ position: "absolute", top: 14, left: 14, width: 42, height: 42, borderRadius: 12, background: `${f.color}dd`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: `0 4px 14px ${f.color}66` }}>{f.emoji}</div>
              </div>
              <div style={{ background: hovered === i ? `rgba(255,255,255,0.06)` : "rgba(255,255,255,0.03)", padding: "16px 18px", transition: "background 0.3s" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{f.desc}</div>
                <div style={{ marginTop: 10, height: 2, borderRadius: 100, background: `linear-gradient(to right, ${f.color}, transparent)` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Carousel Section ──────────────────────────────────────────────────────────
function CarouselSection() {
  const trackRef = useRef(null);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0;
    const speed = 0.28;
    let raf;
    const animate = () => {
      x -= speed;
      const total = track.scrollWidth / 2;
      if (Math.abs(x) >= total) x = 0;
      track.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const doubled = [...CATEGORIES, ...CATEGORIES];

  return (
    <div style={{ padding: "70px 0", background: "linear-gradient(180deg, #0a1a10 0%, #0d2318 50%, #0a1a10 100%)", overflow: "hidden" }}>
      <div style={{ textAlign: "center", marginBottom: 36, padding: "0 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>PARTNER-KATEGORIEN</div>
        <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, margin: "0 0 8px" }}>Überall in deiner Stadt</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>Lokale Lieblinge. Einfach sammeln.</p>
      </div>
      <div style={{ overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #0a1a10, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #0a1a10, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div ref={trackRef} style={{ display: "flex", gap: 14, width: "max-content", padding: "8px 20px" }}>
          {doubled.map((cat, idx) => (
            <div key={idx} style={{
              position: "relative", width: 150, height: 180,
              borderRadius: 20, overflow: "hidden", flexShrink: 0,
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}>
              <img src={cat.img} alt={cat.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%)" }} />
              <div style={{ position: "absolute", bottom: 14, left: 12 }}>
                <div style={{ fontSize: 22, marginBottom: 3 }}>{cat.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{cat.label}</div>
              </div>
              <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: 100, padding: "3px 8px", fontSize: 9, fontWeight: 700, color: "#10B981" }}>Aktiv</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 4 Steps Grid ──────────────────────────────────────────────────────────────
function StepsSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ padding: "70px 20px", background: "linear-gradient(180deg, #0a1a10 0%, #0d2318 50%, #0a1a10 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>SO EINFACH GEHT'S</div>
          <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, margin: "0 0 8px" }}>In 4 Schritten durchstarten</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>Einfach. Schnell. Lohnenswert.</p>
        </div>

        {/* 2×2 Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {HOW_STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                borderRadius: 22, overflow: "hidden", position: "relative",
                border: "1px solid rgba(16,185,129,0.2)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.55s ease ${i * 0.1}s, transform 0.55s ease ${i * 0.1}s`,
              }}
            >
              {/* Photo */}
              <div style={{ height: 160, position: "relative", overflow: "hidden" }}>
                <img
                  src={step.img}
                  alt={step.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)" }} />
                {/* Step number badge */}
                <div style={{
                  position: "absolute", top: 14, left: 14,
                  width: 36, height: 36, borderRadius: 12,
                  background: "rgba(16,185,129,0.9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 900, color: "#fff",
                  boxShadow: "0 4px 14px rgba(16,185,129,0.5)",
                }}>{step.num}</div>
                {/* Emoji top-right */}
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  width: 36, height: 36, borderRadius: 12,
                  background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}>{step.emoji}</div>
              </div>

              {/* Text body */}
              <div style={{ background: "rgba(255,255,255,0.04)", padding: "18px 20px 20px" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>{step.desc}</div>
                <div style={{ marginTop: 14, height: 2, borderRadius: 100, background: "linear-gradient(to right, #10B981, transparent)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Map Section ───────────────────────────────────────────────────────────────
function MapSection() {
  return (
    <div style={{ padding: "70px 20px", background: "linear-gradient(180deg, #0d2318 0%, #0a1a10 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: "0%", right: "-10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>BALD VERFÜGBAR</div>
          <h2 style={{ fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, margin: "0 0 8px" }}>Entdecke Partner in deiner Nähe</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>Komm vorbei, scanne, sammle.</p>
        </div>

        {/* Static map image — non-interactive */}
        <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(16,185,129,0.25)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", height: 380 }}>
          {/* Leaflet-rendered static map snapshot via iframe — pointer events disabled */}
          <iframe
            title="Karte"
            src="https://www.openstreetmap.org/export/embed.html?bbox=13.38,52.51,13.43,52.535&layer=mapnik"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              border: "none", display: "block",
              pointerEvents: "none",
              filter: "invert(0.88) hue-rotate(135deg) saturate(0.5) brightness(0.65)",
            }}
            scrolling="no"
          />
          {/* Overlay blocks all interaction */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(8,20,12,0.35)", pointerEvents: "all", cursor: "default" }} />
          {/* Example pins overlay */}
          {[
            { top: "28%", left: "34%", emoji: "✂️", label: "Kings Barbershop", color: "#10B981" },
            { top: "42%", left: "55%", emoji: "☕", label: "Café Milano", color: "#F59E0B" },
            { top: "58%", left: "42%", emoji: "💅", label: "Bella Nails", color: "#EC4899" },
            { top: "35%", left: "68%", emoji: "💆", label: "Lotus Massage", color: "#8B5CF6" },
            { top: "65%", left: "62%", emoji: "🍕", label: "Pizza Roma", color: "#F97316" },
          ].map((pin, i) => (
            <div key={i} style={{
              position: "absolute", top: pin.top, left: pin.left,
              transform: "translate(-50%, -50%)", zIndex: 4,
            }}>
              {/* Pulse ring */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: 40, height: 40, borderRadius: "50%",
                background: `${pin.color}25`,
                border: `1.5px solid ${pin.color}50`,
                animation: `pulseMap 2.2s ease-in-out ${i * 0.4}s infinite`,
              }} />
              {/* Pin bubble */}
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(8,20,12,0.92)", backdropFilter: "blur(10px)",
                border: `1.5px solid ${pin.color}99`,
                borderRadius: 100, padding: "5px 10px 5px 6px",
                boxShadow: `0 4px 16px rgba(0,0,0,0.5), 0 0 10px ${pin.color}33`,
                whiteSpace: "nowrap",
                cursor: "default",
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${pin.color}cc, ${pin.color}88)`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0,
                }}>{pin.emoji}</div>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>{pin.label}</span>
              </div>
            </div>
          ))}

          {/* Badge overlay */}
          <div style={{
            position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)",
            background: "rgba(8,20,12,0.92)", border: "1px solid rgba(16,185,129,0.45)",
            backdropFilter: "blur(14px)", borderRadius: 100, padding: "10px 24px",
            fontSize: 12, fontWeight: 700, color: "#10B981", whiteSpace: "nowrap",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)", zIndex: 5,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
            Demnächst in deiner Stadt
          </div>
          {/* City label */}
          <div style={{
            position: "absolute", top: 16, left: 18,
            background: "rgba(8,20,12,0.8)", backdropFilter: "blur(10px)",
            borderRadius: 100, padding: "6px 14px",
            display: "flex", alignItems: "center", gap: 6, zIndex: 5,
          }}>
            <span style={{ fontSize: 14 }}>🇩🇪</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>Berlin</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CustomerLanding() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setHeroSlide(i => (i + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#162b1e", fontFamily: "'Inter', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        @keyframes pulse {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%,-50%) scale(1.5); opacity: 0; }
        }
        @keyframes pulseMap {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%,-50%) scale(1.6); opacity: 0; }
        }
        @keyframes pinPop {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes stepFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes stepImgIn {
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes stepContentIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(16,185,129,0.3), 0 4px 20px rgba(0,0,0,0.2); }
          50% { box-shadow: 0 0 24px rgba(16,185,129,0.5), 0 4px 20px rgba(0,0,0,0.2); }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(13,31,20,0.95)", backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(16,185,129,0.12)",
        padding: "0 20px", height: 58,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
          Sensalie<span style={{ color: "#10B981" }}>.</span>
        </div>
        <Link to="/dashboard" style={{
          background: "#10B981", borderRadius: 100, padding: "9px 22px",
          fontSize: 13, fontWeight: 700, color: "#fff", textDecoration: "none",
          boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
        }}>
          Anmelden
        </Link>
      </nav>

      {/* ── HERO ── */}
      <div style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "60px 20px 40px", background: "#0d1410" }}>
        {/* BG slideshow */}
        {HERO_SLIDES.map((s, i) => (
          <img key={s.img} src={s.img} alt="" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: i === heroSlide ? 0.45 : 0,
            transition: "opacity 1.5s ease",
          }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "rgba(13,20,16,0.72)" }} />
        

        {/* Hero Text */}
        <div style={{
          position: "relative", zIndex: 2, textAlign: "center", maxWidth: 600,
          opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}>
          {/* Pill badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 22 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
            {HERO_SLIDES[heroSlide].label} & mehr
          </div>

          <h1 style={{ fontSize: "clamp(36px, 8vw, 68px)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 6px" }}>
            Sammel digitale
          </h1>
          <h1 style={{ fontSize: "clamp(36px, 8vw, 68px)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 24px", color: "#10B981" }}>
            Stempelkarten
          </h1>

          {/* Badges — subtle glow, no float animation */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, alignItems: "center" }}>
            {[
              { emoji: "🎁", text: "Hol dir großartige Prämien", sub: "Rabatte, Gratisleistungen & mehr", delay: "0.2s" },
              { emoji: "💸", text: <span>Verdiene <span style={{ color: "#10B981", fontWeight: 900 }}>100 €</span> und mehr</span>, sub: "Einfach durch Empfehlungen. Passiv. Automatisch.", delay: "0.35s" },
            ].map((item, i) => (
              <div key={i} style={{
                opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.7s ease ${item.delay}, transform 0.7s ease ${item.delay}`,
                textAlign: "center",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 100, padding: "10px 20px", marginBottom: 5,
                  animation: "glowPulse 3s ease-in-out infinite",
                  animationDelay: `${i * 1.2}s`,
                }}>
                  <span style={{ fontSize: 18 }}>{item.emoji}</span>
                  <span style={{ fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 700 }}>{item.text}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{item.sub}</div>
              </div>
            ))}
          </div>

          <Link to="/dashboard" style={{
            display: "inline-block", background: "#10B981", color: "#fff",
            fontWeight: 800, fontSize: 16, padding: "15px 36px", borderRadius: 100,
            textDecoration: "none", boxShadow: "0 8px 30px rgba(16,185,129,0.45)",
            opacity: heroVisible ? 1 : 0,
            transition: "opacity 0.8s ease 0.5s",
          }}>
            Kostenlos registrieren →
          </Link>

          {/* Slide dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 28 }}>
            {HERO_SLIDES.map((_, i) => (
              <div key={i} onClick={() => setHeroSlide(i)} style={{
                width: i === heroSlide ? 20 : 6, height: 6, borderRadius: 100,
                background: i === heroSlide ? "#10B981" : "rgba(255,255,255,0.2)",
                transition: "all 0.35s", cursor: "pointer",
              }} />
            ))}
          </div>
        </div>

        {/* Phone */}
        <div style={{
          position: "relative", zIndex: 2, marginTop: 40,
          animation: "float 4s ease-in-out infinite",
          opacity: heroVisible ? 1 : 0,
          transition: "opacity 0.8s ease 0.3s",
        }}>
          <PhoneMockup />

          {/* 3 checkmarks below phone */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 14, marginTop: 22,
            opacity: heroVisible ? 1 : 0,
            transition: "opacity 0.8s ease 0.7s",
          }}>
            {[
              { label: "Prämie", color: "#10B981", delay: "0s" },
              { label: "Provision", color: "#F59E0B", delay: "0.12s" },
              { label: "Termin", color: "#EC4899", delay: "0.24s" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 5,
                background: "rgba(255,255,255,0.06)", border: `1px solid ${item.color}44`,
                borderRadius: 100, padding: "6px 12px",
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: item.color, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 900, color: "#fff",
                  flexShrink: 0,
                }}>✓</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: 2, animation: "float 2s ease-in-out infinite" }}>
          ENTDECKEN ↓
        </div>
      </div>

      {/* Features — Warum Sensalie */}
      <FeaturesSection />

      {/* Partner Carousel */}
      <CarouselSection />

      {/* 4 Schritte — animated */}
      <StepsSection />

      {/* Berlin Map */}
      <MapSection />

      {/* ── CTA ── */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #0d2318 0%, #0f2d1c 40%, #162d1e 100%)",
        padding: "100px 20px",
      }}>

        {/* Grid pattern */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>JETZT STARTEN</div>
          <h2 style={{ fontSize: "clamp(28px,6vw,52px)", fontWeight: 900, lineHeight: 1.15, margin: "0 0 14px" }}>
            Bereit für mehr<br /><span style={{ color: "#10B981" }}>aus jedem Besuch?</span>
          </h2>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 36, maxWidth: 380, margin: "0 auto 36px" }}>
            Kostenlos starten. Deine Lieblingsgeschäfte. Deine Prämien.
          </div>
          <Link to="/dashboard" style={{
            display: "inline-block", background: "#10B981", color: "#fff",
            fontWeight: 800, fontSize: 16, padding: "16px 44px", borderRadius: 100,
            textDecoration: "none", boxShadow: "0 8px 40px rgba(16,185,129,0.5)",
          }}>
            Jetzt kostenlos registrieren →
          </Link>
          {/* 3 checks under CTA */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 24 }}>
            {["Kostenlos", "Sofort aktiv", "In 1 Minute angemeldet"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                <span style={{ color: "#10B981", fontWeight: 800 }}>✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}