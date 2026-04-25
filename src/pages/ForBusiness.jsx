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
  { num: "01", icon: "⚙️", title: "Du richtest es ein", desc: "Du legst deine Stempelkarte in wenigen Minuten an — Anzahl der Stempel, Belohnung, Provision. Einmal eingestellt, läuft es von alleine.", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80" },
  { num: "02", icon: "📱", title: "Dein Kunde scannt", desc: "Beim nächsten Besuch scannt dein Kunde einfach deinen QR-Code — kein Download, kein Aufwand. Die Stempelkarte ist sofort aktiv.", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80" },
  { num: "03", icon: "📢", title: "Er empfiehlt dich weiter", desc: "Mit einem Klick schickt dein Kunde seinen persönlichen Link an Freunde und Familie — direkt über WhatsApp. Kein Aufwand für dich.", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80" },
  { num: "04", icon: "🚶", title: "Neuer Kunde betritt deinen Laden", desc: "Der empfohlene Freund kommt zu dir, scannt den Code und startet seine eigene Karte. Du gewinnst einen neuen Stammkunden — automatisch.", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" },
  { num: "05", icon: "💰", title: "Du zahlst erst bei Erfolg", desc: "Erst wenn der neue Kunde wirklich da war, löst die Provision aus. Kein Risiko, keine Vorabkosten — du zahlst nur für echte Ergebnisse.", img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80" },
  { num: "06", icon: "∞", title: "Das System arbeitet für dich", desc: "Jeder neue Kunde empfiehlt weiter. Der Kreislauf dreht sich — ohne dass du etwas tun musst. Dein Wachstum passiert im Hintergrund.", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" },
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

// ── Dashboard Preview ──────────────────────────────────────────────────────────
function DashboardPreview({ highlightText }) {
  return (
    <div style={{ background: "#111e28", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.6)", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ background: "#0a1612", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57","#FFBD2E","#28CA41"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ flex: 1, textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>app.sensalie.com/business</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 100, padding: "3px 10px" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: "#10B981" }}>LIVE</span>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: 130, background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "16px 12px" }}>
          {["📋 Übersicht", "👥 Kunden", "💸 Empfehlungen", "⬛ Stempelkarten", "⚙️ Einstellungen"].map((item, i) => (
            <div key={i} style={{ padding: "8px 10px", borderRadius: 8, fontSize: 11, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? "#10B981" : "rgba(255,255,255,0.35)", background: i === 0 ? "rgba(16,185,129,0.1)" : "transparent", marginBottom: 4 }}>{item}</div>
          ))}
        </div>
        <div style={{ flex: 1, padding: "20px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Guten Morgen</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Dein Unternehmen 👋</div>
            </div>
            <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "5px 10px", fontSize: 10, fontWeight: 700, color: "#10B981" }}>Heute: +3 Neukunden</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              { icon: "📈", label: "Umsatz", value: "€4.280", change: "+23%", highlight: true },
              { icon: "👥", label: "Kunden", value: "847", change: "+18%" },
              { icon: "💸", label: "Empfehlungen", value: "234", change: "+31%", highlight: true },
              { icon: "💰", label: "Provision", value: "€1.120", change: "+21%" },
            ].map((s, i) => (
              <div key={i} style={{ background: s.highlight ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${s.highlight ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: 12 }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{s.icon} {s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#10B981", fontWeight: 600 }}>{s.change}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>Umsatz letzte 7 Tage</div>
          <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 40, marginBottom: 12 }}>
            {[30,50,45,70,85,65,90].map((h, i) => (
              <div key={i} style={{ flex: 1, background: "#10B981", borderRadius: "3px 3px 0 0", height: `${h}%`, opacity: 0.6 + i * 0.06 }} />
            ))}
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
          {/* Vertical connector line */}
          <div style={{
            position: "absolute", left: 35, top: 40, bottom: 40,
            width: 2,
            background: "linear-gradient(to bottom, #10B981, rgba(16,185,129,0.1))",
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
        @media(max-width:640px){
          .biz-plans-grid { grid-template-columns: 1fr !important; }
          .biz-hero-btns { flex-direction: column !important; align-items: center !important; }
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
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>LIVE-DASHBOARD</div>
            <h2 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, margin: "0 0 10px" }}>Alles im Blick. Echtzeit.</h2>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>↓ Scroll um alle Metriken zu sehen</div>
          </div>
          <DashboardPreview highlightText={dashHighlight === 0} />
        </div>
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