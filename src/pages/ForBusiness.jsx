import { useState, useEffect } from "react";
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
    ctaStyle: { background: "transparent", border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff" },
  },
  {
    name: "Plus",
    price: "9,90€",
    period: "/Monat",
    badge: "Beliebt",
    badgeColor: "#10B981",
    features: [
      { ok: true, text: "2 Stempelkarten" },
      { ok: true, text: "QR-Code Generator" },
      { ok: true, text: "Empfehlungs-Tracking" },
      { ok: true, text: "1 aktive Provision" },
      { ok: true, text: "Echtzeit-Dashboard" },
      { ok: true, text: "WhatsApp Integration" },
      { ok: true, text: "Basis-Statistiken" },
      { ok: false, text: "Mehrere Provisionen gleichzeitig" },
      { ok: false, text: "Sonderprovisionen für Aktionszeiträume" },
      { ok: false, text: "Credits für Sichtbarkeit" },
    ],
    cta: "Jetzt starten",
    ctaStyle: { background: "#10B981", color: "#fff" },
  },
  {
    name: "Pro",
    price: "14,99€",
    period: "/Monat",
    badge: "Premium",
    badgeColor: "#F59E0B",
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
  },
];

// Dashboard preview component
function DashboardPreview({ highlightText }) {
  return (
    <div style={{ background: "#111e28", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.6)", maxWidth: 560, margin: "0 auto" }}>
      {/* Window chrome */}
      <div style={{ background: "#0a1612", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57","#FFBD2E","#28CA41"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ flex: 1, textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>app.sensalie.com/dashboard</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 100, padding: "3px 10px" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: "#10B981" }}>LIVE</span>
        </div>
      </div>
      {/* Sidebar + content */}
      <div style={{ display: "flex" }}>
        <div style={{ width: 140, background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "16px 12px" }}>
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
              { icon: "📈", label: "Umsatz", value: "€4.280", change: "+23%", tooltip: "Dein Umsatz wächst automatisch — durch Stammkunden & Empfehlungen." },
              { icon: "👥", label: "Kunden", value: "847", change: "+18%", tooltip: null },
              { icon: "💸", label: "Empfehlungen", value: "234", change: "+31%", tooltip: "Provisionen werden automatisch abgerechnet. Null Aufwand für dich." },
              { icon: "💰", label: "Provision", value: "€1.120", change: "+21%", tooltip: null },
            ].map((s, i) => (
              <div key={i} style={{ background: i === 0 || i === 2 ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${i === 0 || i === 2 ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, padding: 12, position: "relative" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>{s.icon} {s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#10B981", fontWeight: 600 }}>{s.change}</div>
                {s.tooltip && highlightText && (
                  <div style={{ position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)", background: "#10B981", borderRadius: 8, padding: "6px 10px", fontSize: 9, fontWeight: 700, color: "#fff", maxWidth: 140, lineHeight: 1.4, zIndex: 10 }}>
                    {s.tooltip}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 8 }}>Umsatz letzte 7 Tage</div>
          <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 40, marginBottom: 12 }}>
            {[30,50,45,70,85,65,90].map((h, i) => (
              <div key={i} style={{ flex: 1, background: "#10B981", borderRadius: "3px 3px 0 0", height: `${h}%`, opacity: 0.6 + i * 0.06 }} />
            ))}
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>● Live-Aktivität</div>
        </div>
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
    <div style={{ minHeight: "100vh", background: "#080f0b", fontFamily: "'Inter', sans-serif", color: "#fff", overflowX: "hidden" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; }`}</style>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,15,11,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
            <div style={{ position: "absolute", inset: 0, background: "rgba(8,15,11,0.75)" }} />
            <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700, color: "#10B981", whiteSpace: "nowrap" }}>
              ● {s.label}
            </div>
          </div>
        ))}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto", padding: "100px 32px", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 32px" }}>
            Wachstum durch Kunden,<br />die wirklich hinter dir<br /><span style={{ color: "#10B981" }}>stehen.</span>
          </h1>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/Business" style={{ background: "#10B981", color: "#fff", fontWeight: 800, fontSize: 16, padding: "16px 34px", borderRadius: 100, textDecoration: "none", boxShadow: "0 8px 30px rgba(16,185,129,0.4)" }}>
              Kostenlos starten →
            </Link>
            <a href="#how" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px 34px", borderRadius: 100, textDecoration: "none" }}>
              So funktioniert's
            </a>
          </div>
        </div>
      </div>

      {/* Stats / Why */}
      <div style={{ padding: "80px 32px", background: "#060d09" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>WARUM SENSALIE?</div>
            <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, margin: 0 }}>Wachstum durch Kunden, die wirklich hinter dir stehen.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 20 }}>
            {[
              { emoji: "🤝", value: "81%", desc: "Vertrauen Empfehlungen von Freunden" },
              { emoji: "📈", value: "+87%", desc: "Mehr Gewinn durch Stammkunden" },
              { emoji: "🛡️", value: "0€", desc: "Vorab-Risiko für dich" },
            ].map(s => (
              <div key={s.value} style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 20, padding: "30px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.emoji}</div>
                <div style={{ fontSize: 40, fontWeight: 900, color: "#10B981", marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Dashboard */}
      <div style={{ padding: "80px 32px", background: "#080f0b" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>LIVE-DASHBOARD</div>
            <h2 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, margin: "0 0 10px" }}>Alles im Blick. Echtzeit.</h2>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>↓ Scroll um alle Metriken zu sehen</div>
          </div>
          <DashboardPreview highlightText={dashHighlight === 0} />
        </div>
      </div>

      {/* How it works — 6 steps */}
      <div id="how" style={{ padding: "80px 32px", background: "#060d09" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>SO GEHT'S</div>
            <h2 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, margin: "0 0 10px" }}>In 6 Schritten zum Wachstum.</h2>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Scroll dich durch — und sieh sofort, was passiert.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {STEPS.map((step, i) => (
              <div key={step.num} style={{ borderRadius: 20, overflow: "hidden", position: "relative", border: "1px solid rgba(255,255,255,0.08)", minHeight: 140 }}>
                <img src={step.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(8,15,11,0.5)" }} />
                <div style={{ position: "relative", zIndex: 1, padding: "28px 28px", display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ fontSize: 32, marginBottom: 4 }}>{step.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#10B981" }}>{step.num}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{step.title}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{step.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video section */}
      <div style={{ padding: "80px 32px", background: "#080f0b" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>SO FUNKTIONIERT SENSALIE</div>
          <h2 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, margin: "0 0 36px" }}>Sieh es in Aktion.</h2>
          <div style={{ background: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80') center/cover", borderRadius: 24, aspectRatio: "16/9", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(8,15,11,0.5)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <div style={{ width: 70, height: 70, background: "#10B981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 0 40px rgba(16,185,129,0.5)", cursor: "pointer" }}>▶</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>2 Minuten — alles erklärt.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: "80px 32px", background: "#060d09" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>PREISE</div>
            <h2 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, margin: "0 0 10px" }}>Transparent. Fair. Risikofrei.</h2>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 20 }}>Kein Vertrag. Jederzeit kündbar.</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 100, padding: "8px 20px", fontSize: 13, fontWeight: 700, color: "#F59E0B" }}>
              🐦 Early-Bird-Aktion — jetzt bis zu 50% günstiger!
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 20 }}>
            {PLANS.map(plan => (
              <div key={plan.name} style={{
                background: plan.badge === "Beliebt" ? "rgba(16,185,129,0.06)" : plan.badge === "Premium" ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.03)",
                border: plan.badge === "Beliebt" ? "1.5px solid rgba(16,185,129,0.35)" : plan.badge === "Premium" ? "1.5px solid rgba(245,158,11,0.35)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24, padding: "28px 24px", position: "relative",
              }}>
                {plan.badge && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: plan.badgeColor, borderRadius: 100, padding: "4px 16px", fontSize: 11, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }}>
                    {plan.badge}
                  </div>
                )}
                <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 24 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: plan.badge === "Premium" ? "#F59E0B" : "#fff" }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>{plan.period}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {plan.features.map(f => (
                    <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: f.ok ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.25)" }}>
                      <span style={{ color: f.ok ? "#10B981" : "#EF4444", flexShrink: 0 }}>{f.ok ? "✓" : "✕"}</span>
                      {f.text}
                    </div>
                  ))}
                </div>
                <button style={{ width: "100%", padding: "14px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 800, ...plan.ctaStyle }}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1400&q=80" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,15,11,0.8)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "100px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(32px,6vw,60px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 16px" }}>
            Kostenlos starten.<br /><span style={{ color: "#10B981" }}>Kein Risiko. Kein Vertrag.</span>
          </h2>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 36 }}>
            Starte noch heute — in 2 Minuten eingerichtet. Deine Kunden werden es lieben.
          </div>
          <Link to="/Business" style={{ display: "inline-block", background: "#10B981", color: "#fff", fontWeight: 800, fontSize: 17, padding: "18px 44px", borderRadius: 100, textDecoration: "none", boxShadow: "0 8px 30px rgba(16,185,129,0.4)" }}>
            Jetzt kostenlos registrieren →
          </Link>
        </div>
      </div>
    </div>
  );
}