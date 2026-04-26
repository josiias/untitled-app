import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const HERO_SLIDES = [
  { img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1400&q=80", label: "Für Nagelstudios" },
  { img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=80", label: "Für Barbershops" },
  { img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1400&q=80", label: "Für Massagestudios" },
  { img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1400&q=80", label: "Für Cafés" },
  { img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&q=80", label: "Für Restaurants" },
];

const STEPS = [
  { num: "01", icon: "⚙️", title: "Einrichten", desc: "Stempelkarte anlegen, Prämie & Provision festlegen. Einmal — läuft dann alleine.", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80" },
  { num: "02", icon: "📱", title: "Kunde scannt", desc: "QR-Code an der Kasse — kein Download, sofort aktiv.", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80" },
  { num: "03", icon: "📢", title: "Empfehlung per WhatsApp", desc: "Kunde teilt seinen Link mit Freunden — ein Klick, kein Aufwand für dich.", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80" },
  { num: "04", icon: "🚶", title: "Neuer Kunde kommt", desc: "Der Freund scannt, startet seine Karte — du gewinnst automatisch einen Stammkunden.", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" },
  { num: "05", icon: "💰", title: "Zahlen nur bei Erfolg", desc: "Provision löst erst aus, wenn der Neue wirklich da war. Kein Risiko.", img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80" },
  { num: "06", icon: "∞", title: "Kreislauf läuft", desc: "Jeder neue Kunde empfiehlt weiter. Dein Wachstum passiert im Hintergrund.", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" },
];

const PLANS = [
  {
    name: "Free",
    price: "0€",
    period: "",
    regularPrice: null,
    badge: null,
    features: [
      { ok: true, text: "1 Stempelkarte" },
      { ok: true, text: "QR-Code Generator" },
      { ok: true, text: "Basis-Statistiken" },
      { ok: true, text: "1 Provision (14 Tage testbar)" },
      { ok: false, text: "Empfehlungs-Tracking" },
      { ok: false, text: "Mehrere Provisionen" },
      { ok: false, text: "Credits für Sichtbarkeit" },
    ],
    cta: "Kostenlos starten",
    ctaStyle: { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.55)" },
    cardStyle: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" },
  },
  {
    name: "Plus",
    price: "9,90€",
    period: "/Monat",
    regularPrice: "29,90€",
    badge: "Beliebt",
    badgeColor: "#10B981",
    pulse: "green",
    features: [
      { ok: true, text: "2 Stempelkarten" },
      { ok: true, text: "QR-Code Generator" },
      { ok: true, text: "Empfehlungs-Tracking" },
      { ok: true, text: "1 aktive Provision" },
      { ok: true, text: "Echtzeit-Dashboard" },
      { ok: true, text: "WhatsApp Integration" },
      { ok: true, text: "Basis-Statistiken" },
      { ok: false, text: "Mehrere Provisionen gleichzeitig" },
      { ok: false, text: "Credits für Sichtbarkeit" },
    ],
    cta: "Jetzt starten",
    ctaStyle: { background: "#10B981", color: "#fff" },
    cardStyle: { background: "rgba(16,185,129,0.07)", border: "1.5px solid rgba(16,185,129,0.4)" },
  },
  {
    name: "Pro",
    price: "14,99€",
    period: "/Monat",
    regularPrice: "49,90€",
    badge: "Premium",
    badgeColor: "#F59E0B",
    pulse: "amber",
    features: [
      { ok: true, text: "Unbegrenzte Stempelkarten" },
      { ok: true, text: "QR-Code Generator" },
      { ok: true, text: "Empfehlungs-Tracking" },
      { ok: true, text: "Mehrere Provisionen gleichzeitig" },
      { ok: true, text: "Sonderprovisionen für Aktionszeiträume" },
      { ok: true, text: "1 kostenloser Credit / Monat" },
      { ok: true, text: "Echtzeit-Dashboard" },
      { ok: true, text: "WhatsApp Integration" },
      { ok: true, text: "Prioritäts-Support" },
    ],
    cta: "Jetzt starten",
    ctaStyle: { background: "#F59E0B", color: "#fff" },
    cardStyle: { background: "rgba(245,158,11,0.06)", border: "1.5px solid rgba(245,158,11,0.35)" },
  },
];

// ── Counter Hook ───────────────────────────────────────────────────────────────
function useCounter(target, duration = 1800, started = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const isFloat = target % 1 !== 0;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(isFloat ? parseFloat((eased * target).toFixed(1)) : Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return val;
}

// ── Stats Section with animated counters ─────────────────────────────────────
function StatsSection() {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const v81 = useCounter(81, 1600, started);
  const v87 = useCounter(87, 1800, started);

  return (
    <div ref={ref} style={{ padding: "80px 32px", background: "#0d1a10" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>WARUM SENSALIE?</div>
          <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, margin: 0, color: "#fff" }}>Wachstum durch Kunden, die wirklich hinter dir stehen.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 20 }}>
          {[
            { emoji: "🤝", value: v81, suffix: "%", desc: "Vertrauen Empfehlungen von Freunden" },
            { emoji: "📈", value: v87, suffix: "%", prefix: "+", desc: "Mehr Gewinn durch Stammkunden" },
            { emoji: "🛡️", value: 0, suffix: "€", desc: "Vorab-Risiko für dich", static: true },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 20, padding: "30px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{s.emoji}</div>
              <div style={{ fontSize: 44, fontWeight: 900, color: "#10B981", marginBottom: 8, fontVariantNumeric: "tabular-nums" }}>
                {s.static ? "0€" : `${s.prefix || ""}${s.value}${s.suffix}`}
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Preview — sticky scroll with speech bubbles ────────────────────
const DASH_TOOLTIPS = [
  {
    label: "Umsatz",
    icon: "📈",
    text: "Dein Mindestumsatz aus allen Stempel-Besuchen — automatisch berechnet.",
    // position on the mockup (relative to browser window)
    top: "38%", left: "52%",
  },
  {
    label: "Kunden",
    icon: "👥",
    text: "Aktive Kunden, die mindestens einmal in den letzten 30 Tagen gescannt haben.",
    top: "38%", left: "76%",
  },
  {
    label: "Empfehlungen",
    icon: "💸",
    text: "Jede erfolgreiche Empfehlung, die einen neuen Kunden gebracht hat.",
    top: "57%", left: "52%",
  },
  {
    label: "Provision",
    icon: "💰",
    text: "Deine gesamte offene Provision — wird automatisch nach X Besuchen ausgelöst.",
    top: "57%", left: "76%",
  },
  {
    label: "Balkendiagramm",
    icon: "📊",
    text: "Live-Umsatzkurve der letzten 7 Tage — du siehst Trends auf einen Blick.",
    top: "78%", left: "60%",
  },
];

function DashboardPreview() {
  const [activeTooltip, setActiveTooltip] = useState(0);
  const [barHeights, setBarHeights] = useState([30,50,45,70,85,65,90]);
  const sectionRef = useRef(null);
  const mockupRef = useRef(null);

  // Scroll-driven tooltip cycling
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = sectionRef.current.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / Math.max(total, 1));
      const idx = Math.min(DASH_TOOLTIPS.length - 1, Math.floor(progress * DASH_TOOLTIPS.length));
      setActiveTooltip(idx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate bars
  useEffect(() => {
    const t = setInterval(() => {
      setBarHeights(prev => prev.map(h => Math.max(20, Math.min(95, h + (Math.random() - 0.5) * 18))));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const tip = DASH_TOOLTIPS[activeTooltip];

  // Which stat cards map to which tooltip index
  const statHighlight = [0, 1, 2, 3]; // indices 0-3 map to tooltip 0-3, index 4 = chart

  return (
    <div ref={sectionRef} style={{ height: `${DASH_TOOLTIPS.length * 80}vh`, position: "relative" }}>
      {/* Sticky wrapper */}
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
        <div style={{ maxWidth: 780, width: "100%", margin: "0 auto" }}>

          {/* Header above mockup */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>LIVE-DASHBOARD</div>
            <h2 style={{ fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
              Alles im Blick. <span style={{ color: "#10B981" }}>Echtzeit.</span>
            </h2>
          </div>

          {/* Browser mockup — full width, with speech bubble overlay */}
          <div ref={mockupRef} style={{ position: "relative" }}>

            {/* Speech bubble */}
            <div style={{
              position: "absolute",
              top: tip.top, left: tip.left,
              zIndex: 20,
              transform: "translate(-50%, -130%)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
              pointerEvents: "none",
            }}>
              <div style={{
                background: "rgba(10,22,16,0.96)",
                border: "1px solid rgba(16,185,129,0.5)",
                borderRadius: 12,
                padding: "10px 14px",
                maxWidth: 200,
                boxShadow: "0 8px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.1)",
                backdropFilter: "blur(10px)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#10B981", marginBottom: 4 }}>
                  {tip.icon} {tip.label}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
                  {tip.text}
                </div>
                {/* Arrow */}
                <div style={{
                  position: "absolute", bottom: -7, left: "50%", transform: "translateX(-50%)",
                  width: 0, height: 0,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderTop: "7px solid rgba(16,185,129,0.5)",
                }} />
              </div>
            </div>

            {/* Highlight dot on the active area */}
            <div style={{
              position: "absolute",
              top: tip.top, left: tip.left,
              transform: "translate(-50%, -50%)",
              zIndex: 19,
              width: 16, height: 16,
              borderRadius: "50%",
              background: "rgba(16,185,129,0.3)",
              border: "2px solid #10B981",
              boxShadow: "0 0 12px rgba(16,185,129,0.6)",
              animation: "liveDot 1.2s ease-in-out infinite",
              transition: "top 0.4s ease, left 0.4s ease",
              pointerEvents: "none",
            }} />

            {/* Browser chrome */}
            <div style={{
              background: "#111e28", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)",
              overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
            }}>
              {/* Title bar */}
              <div style={{ background: "#0a1612", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#FF5F57","#FFBD2E","#28CA41"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                </div>
                <div style={{ flex: 1, textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>app.sensalie.com/business</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 100, padding: "2px 8px" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981", animation: "liveDot 1.5s ease-in-out infinite" }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#10B981" }}>LIVE</span>
                </div>
              </div>

              <div style={{ display: "flex" }}>
                {/* Sidebar */}
                <div style={{ width: 110, background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "14px 10px" }}>
                  {["📋 Übersicht", "👥 Kunden", "💸 Empfehlungen", "⬛ Karten", "⚙️ Einstellungen"].map((item, i) => (
                    <div key={i} style={{ padding: "7px 9px", borderRadius: 7, fontSize: 10, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? "#10B981" : "rgba(255,255,255,0.3)", background: i === 0 ? "rgba(16,185,129,0.1)" : "transparent", marginBottom: 3 }}>{item}</div>
                  ))}
                </div>

                {/* Main content */}
                <div style={{ flex: 1, padding: "16px 16px" }}>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>Guten Morgen</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>Dein Unternehmen 👋</div>
                  </div>

                  {/* 4 stat cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                    {[
                      { icon: "📈", label: "Umsatz", value: "€4.280", change: "+23%", hi: true },
                      { icon: "👥", label: "Kunden", value: "847", change: "+18%", hi: false },
                      { icon: "💸", label: "Empfehlungen", value: "234", change: "+31%", hi: true },
                      { icon: "💰", label: "Provision", value: "€1.120", change: "+21%", hi: false },
                    ].map((s, i) => {
                      const isHighlighted = activeTooltip === i;
                      return (
                        <div key={i} style={{
                          background: s.hi ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)",
                          border: isHighlighted
                            ? "1.5px solid rgba(16,185,129,0.7)"
                            : `1px solid ${s.hi ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.07)"}`,
                          borderRadius: 10, padding: "10px 11px",
                          transition: "border-color 0.35s ease, box-shadow 0.35s ease",
                          boxShadow: isHighlighted ? "0 0 14px rgba(16,185,129,0.25)" : "none",
                        }}>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>{s.icon} {s.label}</div>
                          <div style={{ fontSize: 17, fontWeight: 900, color: "#fff" }}>{s.value}</div>
                          <div style={{ fontSize: 9, color: "#10B981", fontWeight: 600 }}>{s.change}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bar chart */}
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>Umsatz letzte 7 Tage</div>
                  <div style={{
                    display: "flex", gap: 4, alignItems: "flex-end", height: 44,
                    border: activeTooltip === 4 ? "1.5px solid rgba(16,185,129,0.5)" : "1.5px solid transparent",
                    borderRadius: 8, padding: "0 4px",
                    transition: "border-color 0.35s ease",
                    boxShadow: activeTooltip === 4 ? "0 0 14px rgba(16,185,129,0.2)" : "none",
                  }}>
                    {barHeights.map((h, i) => (
                      <div key={i} style={{
                        flex: 1, background: "linear-gradient(to top, #10B981, #34D399)",
                        borderRadius: "3px 3px 0 0", height: `${h}%`,
                        opacity: 0.55 + i * 0.06,
                        transition: "height 1.8s cubic-bezier(0.34,1.56,0.64,1)",
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
              {DASH_TOOLTIPS.map((t, i) => (
                <div key={i} style={{
                  width: i === activeTooltip ? 20 : 6, height: 6, borderRadius: 100,
                  background: i === activeTooltip ? "#10B981" : "rgba(255,255,255,0.15)",
                  transition: "all 0.3s ease",
                }} />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
              ↓ Weiter scrollen um alle Funktionen zu entdecken
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Steps Section with scroll-triggered slide-in + hover glow ─────────────────
function StepsSlideSection() {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [hoveredStep, setHoveredStep] = useState(null);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observers = STEPS.map((_, i) => {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setVisibleSteps(prev => prev.includes(i) ? prev : [...prev, i]); },
        { threshold: 0.2 }
      );
      if (stepRefs.current[i]) obs.observe(stepRefs.current[i]);
      return obs;
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <div id="how" style={{ padding: "80px 20px", background: "#0d1a10" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>SO GEHT'S</div>
          <h2 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, margin: "0 0 10px", color: "#fff" }}>In 6 Schritten zum Wachstum.</h2>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>Scroll dich durch — und sieh sofort, was passiert.</div>
        </div>

        {/* Connected steps with vertical line */}
        <div style={{ position: "relative" }}>
          {/* Vertical connector line — left edge of cards, subtle */}
          <div style={{
            position: "absolute", left: 0, top: 20, bottom: 20,
            width: 1,
            background: "linear-gradient(to bottom, rgba(16,185,129,0.4), rgba(16,185,129,0.05))",
            zIndex: 0,
          }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {STEPS.map((step, i) => {
              const isVisible = visibleSteps.includes(i);
              const isHovered = hoveredStep === i;
              const fromLeft = i % 2 === 0;
              return (
                <div
                  key={step.num}
                  ref={el => stepRefs.current[i] = el}
                  onMouseEnter={() => setHoveredStep(i)}
                  onMouseLeave={() => setHoveredStep(null)}
                  style={{
                    borderRadius: 20, overflow: "hidden", position: "relative",
                    border: isHovered
                      ? "1.5px solid rgba(16,185,129,0.7)"
                      : isVisible
                        ? "1px solid rgba(16,185,129,0.25)"
                        : "1px solid rgba(255,255,255,0.06)",
                    minHeight: 130,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? (isHovered ? "translateX(6px) scale(1.01)" : "translateX(0)")
                      : `translateX(${fromLeft ? "-60px" : "60px"})`,
                    transition: `opacity 0.7s ease ${i * 0.06}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease, box-shadow 0.3s ease`,
                    boxShadow: isHovered
                      ? "0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(16,185,129,0.2)"
                      : isVisible ? "0 6px 24px rgba(0,0,0,0.3)" : "none",
                    cursor: "default",
                    zIndex: isHovered ? 2 : 1,
                  }}
                >
                  <img src={step.img} alt="" style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                    opacity: isHovered ? 0.35 : 0.18,
                    transform: isHovered ? "scale(1.04)" : "scale(1)",
                    transition: "opacity 0.4s, transform 0.6s",
                  }} />
                  <div style={{ position: "absolute", inset: 0, background: isHovered ? "rgba(8,20,10,0.5)" : "rgba(8,20,10,0.6)" }} />
                  {/* Top glow bar */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: isHovered
                      ? "linear-gradient(90deg, #10B981, #34D399, #10B981)"
                      : isVisible ? "linear-gradient(90deg, rgba(16,185,129,0.4), transparent)" : "transparent",
                    transition: "background 0.3s",
                  }} />
                  <div style={{ position: "relative", zIndex: 1, padding: "26px 28px", display: "flex", alignItems: "center", gap: 22 }}>
                    {/* Icon + number */}
                    <div style={{ flexShrink: 0, textAlign: "center", width: 54 }}>
                      <div style={{
                        width: 54, height: 54, borderRadius: 16,
                        background: isHovered ? "rgba(16,185,129,0.25)" : "rgba(16,185,129,0.12)",
                        border: isHovered ? "2px solid rgba(16,185,129,0.8)" : "1.5px solid rgba(16,185,129,0.35)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: isHovered ? 26 : 22, marginBottom: 6,
                        boxShadow: isHovered ? "0 0 20px rgba(16,185,129,0.45)" : "none",
                        transition: "all 0.3s ease",
                      }}>{step.icon}</div>
                      <div style={{ fontSize: 11, fontWeight: 900, color: "#10B981" }}>{step.num}</div>
                    </div>
                    {/* Text */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 17, fontWeight: 800, marginBottom: 8,
                        color: isHovered ? "#fff" : "rgba(255,255,255,0.9)",
                        transition: "color 0.3s",
                      }}>{step.title}</div>
                      <div style={{
                        fontSize: 13,
                        color: isHovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)",
                        lineHeight: 1.65, transition: "color 0.3s",
                      }}>{step.desc}</div>
                    </div>
                    {/* Arrow indicator on hover */}
                    <div style={{
                      flexShrink: 0, fontSize: 20, color: "#10B981",
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? "translateX(0)" : "translateX(-8px)",
                      transition: "all 0.3s ease",
                    }}>→</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CTA with parallax image ────────────────────────────────────────────────────
function CtaForBusiness() {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef(null);
  const [offsetTop, setOffsetTop] = useState(9999);

  useEffect(() => {
    if (ref.current) setOffsetTop(ref.current.offsetTop);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const parallax = (scrollY - offsetTop) * 0.15;

  return (
    <div ref={ref} style={{ position: "relative", overflow: "hidden", padding: "100px 32px", textAlign: "center" }}>
      <img
        src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1400&q=80"
        alt=""
        style={{
          position: "absolute", inset: 0, width: "100%", height: "120%", objectFit: "cover",
          top: "-10%",
          transform: `translateY(${parallax}px)`,
          transition: "transform 0.05s linear",
          willChange: "transform",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(6,13,9,0.72)" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: "clamp(32px,6vw,60px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 16px", color: "#fff" }}>
          Kostenlos starten.<br /><span style={{ color: "#10B981" }}>Kein Risiko. Kein Vertrag.</span>
        </h2>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 36 }}>
          Starte noch heute — in 2 Minuten eingerichtet. Deine Kunden werden es lieben.
        </div>
        <Link to="/Business" style={{
          display: "inline-block", background: "#10B981", color: "#fff", fontWeight: 800, fontSize: 17,
          padding: "18px 44px", borderRadius: 100, textDecoration: "none",
          animation: "bizCtaPulse 2.5s ease-in-out infinite",
        }}>
          Jetzt kostenlos registrieren →
        </Link>
      </div>
    </div>
  );
}

export default function ForBusiness() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [dashHighlight, setDashHighlight] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroSlide(i => (i + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setDashHighlight(i => (i + 1) % 2), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a1410", fontFamily: "'Inter', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes bizCtaPulse {
          0%, 100% { box-shadow: 0 8px 30px rgba(16,185,129,0.4), 0 0 0 0 rgba(16,185,129,0.25); }
          50% { box-shadow: 0 8px 50px rgba(16,185,129,0.6), 0 0 0 14px rgba(16,185,129,0); }
        }
        @keyframes plusSwing {
          0%, 100% { transform: rotate(-1.5deg) translateY(0px); }
          25% { transform: rotate(1.5deg) translateY(-3px); }
          50% { transform: rotate(-1deg) translateY(-1px); }
          75% { transform: rotate(1deg) translateY(-4px); }
        }
        @keyframes proPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.25), 0 8px 32px rgba(0,0,0,0.35); }
          50% { box-shadow: 0 0 0 8px rgba(245,158,11,0), 0 8px 32px rgba(0,0,0,0.35); }
        }
        @keyframes featureSlideIn {
          from { opacity: 0; transform: translateX(-14px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes dashFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes badgePop {
          from { opacity: 0; transform: scale(0.8) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes liveDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
        @media(max-width:640px){
          .biz-plans-grid { grid-template-columns: 1fr !important; }
          .biz-hero-btns { flex-direction: column !important; align-items: center !important; }
          .dash-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,20,16,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>Sensalie<span style={{ color: "#10B981" }}>.</span></div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/Business" style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", textDecoration: "none", fontWeight: 500 }}>Login</Link>
          <Link to="/Business" style={{ background: "#10B981", color: "#fff", fontWeight: 700, fontSize: 14, padding: "10px 22px", borderRadius: 100, textDecoration: "none" }}>Kostenlos starten</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {HERO_SLIDES.map((s, i) => (
          <div key={s.img} style={{ position: "absolute", inset: 0, transition: "opacity 1.5s ease", opacity: i === heroSlide ? 1 : 0 }}>
            <img src={s.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(8,15,11,0.72)" }} />
            <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700, color: "#10B981", whiteSpace: "nowrap" }}>
              ● {s.label}
            </div>
          </div>
        ))}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto", padding: "100px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(36px, 7vw, 68px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 32px" }}>
            Wachstum durch Kunden,<br />die wirklich hinter dir<br /><span style={{ color: "#10B981" }}>stehen.</span>
          </h1>
          <div className="biz-hero-btns" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/Business" style={{ background: "#10B981", color: "#fff", fontWeight: 800, fontSize: 16, padding: "16px 34px", borderRadius: 100, textDecoration: "none", boxShadow: "0 8px 30px rgba(16,185,129,0.4)" }}>
              Kostenlos starten →
            </Link>
            <a href="#how" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px 34px", borderRadius: 100, textDecoration: "none" }}>
              So funktioniert's
            </a>
          </div>
        </div>
      </div>

      {/* Stats with counters */}
      <StatsSection />

      {/* Live Dashboard */}
      <div style={{ padding: "80px 24px", background: "#0a1410" }}>
        <DashboardPreview />
      </div>

      {/* 6 Steps with slide-in */}
      <StepsSlideSection />

      {/* Pricing */}
      <div style={{ padding: "80px 24px", background: "#0a1410" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>PREISE</div>
            <h2 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, margin: "0 0 10px" }}>Transparent. Fair. Risikofrei.</h2>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 20 }}>Kein Vertrag. Jederzeit kündbar.</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 100, padding: "8px 20px", fontSize: 13, fontWeight: 700, color: "#F59E0B" }}>
              🐦 Early-Bird-Aktion — jetzt bis zu 50% günstiger!
            </div>
          </div>
          <div className="biz-plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "start" }}>
            {PLANS.map((plan, pi) => (
              <div key={plan.name} style={{
                ...plan.cardStyle,
                borderRadius: 24, padding: "32px 22px", position: "relative",
                animation: plan.pulse === "green"
                  ? "plusSwing 4s ease-in-out infinite"
                  : plan.pulse === "amber"
                    ? "proPulse 3.5s ease-in-out infinite"
                    : "none",
              }}>
                {plan.badge && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: plan.badgeColor, borderRadius: 100, padding: "4px 16px", fontSize: 11, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ fontSize: 18, fontWeight: 900, color: plan.badge ? "#fff" : "rgba(255,255,255,0.6)", marginBottom: 6 }}>{plan.name}</div>

                {/* Early bird price + strikethrough */}
                {plan.regularPrice ? (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "line-through" }}>{plan.regularPrice}</span>
                      <span style={{ background: "#F59E0B", color: "#000", fontSize: 9, fontWeight: 900, borderRadius: 100, padding: "2px 7px" }}>EARLY BIRD</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: 40, fontWeight: 900, color: plan.pulse === "amber" ? "#F59E0B" : "#10B981" }}>{plan.price}</span>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{plan.period}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                    <span style={{ fontSize: 40, fontWeight: 900, color: "rgba(255,255,255,0.5)" }}>{plan.price}</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>{plan.period}</span>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                  {plan.features.map((f, fi) => (
                    <div
                      key={f.text}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        fontSize: 12,
                        color: f.ok
                          ? (plan.badge ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)")
                          : "rgba(255,255,255,0.22)",
                        animation: `featureSlideIn 0.4s ease ${fi * 0.05}s both`,
                      }}
                    >
                      <span style={{
                        flexShrink: 0,
                        fontWeight: 700,
                        fontSize: 13,
                        color: f.ok
                          ? (plan.badge ? "#10B981" : "rgba(255,255,255,0.35)")
                          : "#EF4444",
                        animation: !f.ok ? `featureSlideIn 0.4s ease ${fi * 0.05 + 0.1}s both` : "none",
                      }}>
                        {f.ok ? "✓" : "✕"}
                      </span>
                      {f.text}
                    </div>
                  ))}
                </div>
                <button style={{ width: "100%", padding: "13px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 800, ...plan.ctaStyle }}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA with parallax */}
      <CtaForBusiness />
    </div>
  );
}