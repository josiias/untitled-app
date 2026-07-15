import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import FaqSection from "@/components/FaqSection";
import SocialProof from "@/components/SocialProof";
import WaitingListForm from "@/components/WaitingListForm";
import SiteFooter from "@/components/SiteFooter";
import DemoModal from "@/components/business/DemoModal";
import WaitlistCounter from "@/components/business/WaitlistCounter";
import VideoSection from "@/components/business/VideoSection";

const T = {
  de: {
    nav_login: "Login",
    nav_cta: "Kostenlos starten",
    hero_h1: "Wachstum durch Kunden,\ndie wirklich hinter dir\nstehen.",
    hero_cta: "Kostenlos starten →",
    hero_how: "So funktioniert's",
    hero_demo: "🚀 Demo ausprobieren",
    stats_label: "WARUM SENSALIE?",
    stats_h2: "Wachstum durch Kunden, die wirklich hinter dir stehen.",
    stats: [
      { emoji: "🤝", suffix: "%", desc: "Vertrauen Empfehlungen von Freunden", val: 81 },
      { emoji: "📈", prefix: "+", suffix: "%", desc: "Mehr Gewinn durch Stammkunden", val: 87 },
      { emoji: "🛡️", desc: "Vorab-Risiko für dich", static: "0€" },
    ],
    dash_label: "LIVE-DASHBOARD",
    dash_h2: "Alles im Blick. Echtzeit.",
    dash_scroll: "↓ Weiter scrollen um alle Funktionen zu entdecken",
    how_label: "SO GEHT'S",
    how_h2: "In 6 Schritten zum Wachstum.",
    how_sub: "Scroll dich durch — und sieh sofort, was passiert.",
    price_label: "PREISE",
    price_h2: "Transparent. Fair. Risikofrei.",
    price_sub: "Kein Vertrag. Jederzeit kündbar.",
    price_bird: "🐦 Early-Bird-Aktion — jetzt bis zu 50% günstiger!",
    cta_h2: "Kostenlos starten.\nKein Risiko. Kein Vertrag.",
    cta_sub: "Starte noch heute — in 2 Minuten eingerichtet. Deine Kunden werden es lieben.",
    cta_btn: "Jetzt kostenlos registrieren →",
  },
  en: {
    nav_login: "Login",
    nav_cta: "Get started free",
    hero_h1: "Growth through customers\nwho truly stand\nbehind you.",
    hero_cta: "Get started free →",
    hero_how: "How it works",
    hero_demo: "🚀 Try the demo",
    stats_label: "WHY SENSALIE?",
    stats_h2: "Growth through customers who truly stand behind you.",
    stats: [
      { emoji: "🤝", suffix: "%", desc: "Trust recommendations from friends", val: 81 },
      { emoji: "📈", prefix: "+", suffix: "%", desc: "More profit through loyal customers", val: 87 },
      { emoji: "🛡️", desc: "Upfront risk for you", static: "0€" },
    ],
    dash_label: "LIVE DASHBOARD",
    dash_h2: "Everything at a glance. Real-time.",
    dash_scroll: "↓ Keep scrolling to discover all features",
    how_label: "HOW IT WORKS",
    how_h2: "6 steps to growth.",
    how_sub: "Scroll through — and see what happens immediately.",
    price_label: "PRICING",
    price_h2: "Transparent. Fair. Risk-free.",
    price_sub: "No contract. Cancel anytime.",
    price_bird: "🐦 Early-Bird offer — up to 50% off!",
    cta_h2: "Start for free.\nNo risk. No contract.",
    cta_sub: "Get started today — set up in 2 minutes. Your customers will love it.",
    cta_btn: "Register for free now →",
  },
};

const HERO_SLIDES = [
  { img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1400&q=80", label: { de: "Für Nagelstudios", en: "For Nail Studios" } },
  { img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&q=80", label: { de: "Für Barbershops", en: "For Barbershops" } },
  { img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1400&q=80", label: { de: "Für Massagestudios", en: "For Massage Studios" } },
  { img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1400&q=80", label: { de: "Für Cafés", en: "For Cafés" } },
  { img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&q=80", label: { de: "Für Restaurants", en: "For Restaurants" } },
];

const STEPS = {
  de: [
    { num: "01", icon: "⚙️", title: "Einrichten", desc: "Stempelkarte anlegen, Prämie & Provision festlegen. Einmal — läuft dann alleine.", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80" },
    { num: "02", icon: "📱", title: "Kunde scannt", desc: "QR-Code an der Kasse — kein Download, sofort aktiv.", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80" },
    { num: "03", icon: "📢", title: "Empfehlung per WhatsApp", desc: "Kunde teilt seinen Link mit Freunden — ein Klick, kein Aufwand für dich.", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80" },
    { num: "04", icon: "🚶", title: "Neuer Kunde kommt", desc: "Der Freund scannt, startet seine Karte — du gewinnst automatisch einen Stammkunden.", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" },
    { num: "05", icon: "💰", title: "Zahlen nur bei Erfolg", desc: "Provision löst erst aus, wenn der Neue wirklich da war. Kein Risiko.", img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80" },
    { num: "06", icon: "∞", title: "Kreislauf läuft", desc: "Jeder neue Kunde empfiehlt weiter. Dein Wachstum passiert im Hintergrund.", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" },
  ],
  en: [
    { num: "01", icon: "⚙️", title: "Set up", desc: "Create your stamp card, set your reward & commission. Once — then it runs itself.", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80" },
    { num: "02", icon: "📱", title: "Customer scans", desc: "QR code at the register — no download needed, instantly active.", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80" },
    { num: "03", icon: "📢", title: "Referral via WhatsApp", desc: "Customer shares their link with friends — one click, zero effort for you.", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80" },
    { num: "04", icon: "🚶", title: "New customer arrives", desc: "Friend scans, starts their card — you automatically gain a loyal customer.", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" },
    { num: "05", icon: "💰", title: "Pay only on success", desc: "Commission only triggers when the new customer actually visited. Zero risk.", img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80" },
    { num: "06", icon: "∞", title: "The cycle runs", desc: "Every new customer refers further. Your growth happens in the background.", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" },
  ],
};

const PLANS = [
  {
    name: "Free",
    price: "0€",
    period: { de: "", en: "" },
    regularPrice: null,
    badge: null,
    features: {
      de: [
        { ok: true, text: "1 Stempelkarte" },
        { ok: true, text: "QR-Code Generator" },
        { ok: true, text: "Basis-Statistiken" },
        { ok: true, text: "1 Provision (14 Tage testbar)" },
        { ok: false, text: "Empfehlungs-Tracking" },
        { ok: false, text: "Mehrere Provisionen" },
        { ok: false, text: "Credits für Sichtbarkeit" },
      ],
      en: [
        { ok: true, text: "1 stamp card" },
        { ok: true, text: "QR code generator" },
        { ok: true, text: "Basic statistics" },
        { ok: true, text: "1 commission (14-day trial)" },
        { ok: false, text: "Referral tracking" },
        { ok: false, text: "Multiple commissions" },
        { ok: false, text: "Visibility credits" },
      ],
    },
    cta: { de: "Kostenlos starten", en: "Get started free" },
    ctaStyle: { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.55)" },
    cardStyle: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" },
  },
  {
    name: "Plus",
    price: "9,90€",
    period: { de: "/Monat", en: "/month" },
    regularPrice: "29,90€",
    badge: { de: "Beliebt", en: "Popular" },
    badgeColor: "#10B981",
    pulse: "green",
    features: {
      de: [
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
      en: [
        { ok: true, text: "2 stamp cards" },
        { ok: true, text: "QR code generator" },
        { ok: true, text: "Referral tracking" },
        { ok: true, text: "1 active commission" },
        { ok: true, text: "Real-time dashboard" },
        { ok: true, text: "WhatsApp integration" },
        { ok: true, text: "Basic statistics" },
        { ok: false, text: "Multiple commissions at once" },
        { ok: false, text: "Visibility credits" },
      ],
    },
    cta: { de: "Jetzt starten", en: "Get started" },
    ctaStyle: { background: "#10B981", color: "#fff" },
    cardStyle: { background: "rgba(16,185,129,0.07)", border: "1.5px solid rgba(16,185,129,0.4)" },
  },
  {
    name: "Pro",
    price: "14,99€",
    period: { de: "/Monat", en: "/month" },
    regularPrice: "49,90€",
    badge: { de: "Premium", en: "Premium" },
    badgeColor: "#F59E0B",
    pulse: "amber",
    features: {
      de: [
        { ok: true, text: "Unbegrenzte Stempelkarten" },
        { ok: true, text: "QR-Code Generator" },
        { ok: true, text: "Empfehlungs-Tracking" },
        { ok: true, text: "Mehrere Provisionen gleichzeitig" },
        { ok: true, text: "Sonderprovisionen für Aktionszeiträume" },
        { ok: true, text: "1 kostenloser Credit / Monat" },
        { ok: true, text: "Echtzeit-Dashboard" },
        { ok: true, text: "WhatsApp Integration" },
        { ok: true, text: "Prioritäts-Support" },
        { ok: true, text: "📅 Team-Terminbuchung (Mitarbeiter-Kalender)", highlight: true },
        { ok: true, text: "👤 Mitarbeiter-Profile & Fotoauswahl", highlight: true },
        { ok: true, text: "📊 Auslastungsübersicht je Mitarbeiter", highlight: true },
        { ok: true, text: "✉️ Bestätigungsnummer & Kunden-Kommentare", highlight: true },
      ],
      en: [
        { ok: true, text: "Unlimited stamp cards" },
        { ok: true, text: "QR code generator" },
        { ok: true, text: "Referral tracking" },
        { ok: true, text: "Multiple commissions at once" },
        { ok: true, text: "Special commissions for promotions" },
        { ok: true, text: "1 free credit / month" },
        { ok: true, text: "Real-time dashboard" },
        { ok: true, text: "WhatsApp integration" },
        { ok: true, text: "Priority support" },
        { ok: true, text: "📅 Team appointment booking", highlight: true },
        { ok: true, text: "👤 Employee profiles & photo selection", highlight: true },
        { ok: true, text: "📊 Utilization overview per employee", highlight: true },
        { ok: true, text: "✉️ Confirmation numbers & customer comments", highlight: true },
      ],
    },
    cta: { de: "Jetzt starten", en: "Get started" },
    ctaStyle: { background: "#F59E0B", color: "#fff" },
    cardStyle: { background: "rgba(245,158,11,0.06)", border: "1.5px solid rgba(245,158,11,0.35)" },
  },
];

function useCounter(target, duration = 1800, started = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return val;
}

function StatsSection({ lang, t }) {
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
          <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{t.stats_label}</div>
          <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, margin: 0, color: "#fff" }}>{t.stats_h2}</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 20 }}>
          {t.stats.map((s, i) => {
            const computed = s.val === 81 ? v81 : s.val === 87 ? v87 : null;
            return (
              <div key={i} style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.18)", borderRadius: 20, padding: "30px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.emoji}</div>
                <div style={{ fontSize: 44, fontWeight: 900, color: "#10B981", marginBottom: 8, fontVariantNumeric: "tabular-nums" }}>
                  {s.static ? s.static : `${s.prefix || ""}${computed}${s.suffix}`}
                </div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const DASH_TOOLTIPS = {
  de: [
    { label: "Umsatz", icon: "📈", text: "Dein Mindestumsatz aus allen Stempel-Besuchen — automatisch berechnet.", top: "38%", left: "52%" },
    { label: "Kunden", icon: "👥", text: "Aktive Kunden, die mindestens einmal in den letzten 30 Tagen gescannt haben.", top: "38%", left: "76%" },
    { label: "Empfehlungen", icon: "💸", text: "Jede erfolgreiche Empfehlung, die einen neuen Kunden gebracht hat.", top: "57%", left: "52%" },
    { label: "Provision", icon: "💰", text: "Deine gesamte offene Provision — wird automatisch nach X Besuchen ausgelöst.", top: "57%", left: "76%" },
    { label: "Balkendiagramm", icon: "📊", text: "Live-Umsatzkurve der letzten 7 Tage — du siehst Trends auf einen Blick.", top: "78%", left: "60%" },
  ],
  en: [
    { label: "Revenue", icon: "📈", text: "Your minimum revenue from all stamp visits — calculated automatically.", top: "38%", left: "52%" },
    { label: "Customers", icon: "👥", text: "Active customers who scanned at least once in the last 30 days.", top: "38%", left: "76%" },
    { label: "Referrals", icon: "💸", text: "Every successful referral that brought in a new customer.", top: "57%", left: "52%" },
    { label: "Commission", icon: "💰", text: "Your total open commission — triggered automatically after X visits.", top: "57%", left: "76%" },
    { label: "Bar chart", icon: "📊", text: "Live revenue curve for the last 7 days — see trends at a glance.", top: "78%", left: "60%" },
  ],
};

function DashboardPreview({ lang, t }) {
  const [activeTooltip, setActiveTooltip] = useState(0);
  const [barHeights, setBarHeights] = useState([30, 50, 45, 70, 85, 65, 90]);
  const sectionRef = useRef(null);
  const tips = DASH_TOOLTIPS[lang];

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = sectionRef.current.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / Math.max(total, 1));
      setActiveTooltip(Math.min(tips.length - 1, Math.floor(progress * tips.length)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lang]);

  useEffect(() => {
    const timer = setInterval(() => {
      setBarHeights(prev => prev.map(h => Math.max(20, Math.min(95, h + (Math.random() - 0.5) * 18))));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const tip = tips[activeTooltip];

  return (
    <div ref={sectionRef} style={{ height: `${tips.length * 80}vh`, position: "relative", overflow: "visible" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
        <div style={{ maxWidth: 780, width: "100%", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>{t.dash_label}</div>
            <h2 style={{ fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 900, margin: 0, lineHeight: 1.2 }}>{t.dash_h2}</h2>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: tip.top, left: tip.left, zIndex: 20, transform: "translate(-50%, -130%)", transition: "opacity 0.4s ease", pointerEvents: "none" }}>
              <div style={{ background: "rgba(10,22,16,0.96)", border: "1px solid rgba(16,185,129,0.5)", borderRadius: 12, padding: "10px 14px", maxWidth: 200, boxShadow: "0 8px 30px rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#10B981", marginBottom: 4 }}>{tip.icon} {tip.label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{tip.text}</div>
                <div style={{ position: "absolute", bottom: -7, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "7px solid rgba(16,185,129,0.5)" }} />
              </div>
            </div>
            <div style={{ position: "absolute", top: tip.top, left: tip.left, transform: "translate(-50%, -50%)", zIndex: 19, width: 16, height: 16, borderRadius: "50%", background: "rgba(16,185,129,0.3)", border: "2px solid #10B981", boxShadow: "0 0 12px rgba(16,185,129,0.6)", animation: "liveDot 1.2s ease-in-out infinite", transition: "top 0.4s ease, left 0.4s ease", pointerEvents: "none" }} />
            <div style={{ background: "#111e28", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }}>
              <div style={{ background: "#0a1612", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", gap: 5 }}>{["#FF5F57", "#FFBD2E", "#28CA41"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}</div>
                <div style={{ flex: 1, textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>app.sensalie.com/business</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 100, padding: "2px 8px" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981", animation: "liveDot 1.5s ease-in-out infinite" }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#10B981" }}>LIVE</span>
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ width: 110, background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "14px 10px" }}>
                  {(lang === "de" ? ["📋 Übersicht", "👥 Kunden", "💸 Empfehlungen", "⬛ Karten", "⚙️ Einstellungen"] : ["📋 Overview", "👥 Customers", "💸 Referrals", "⬛ Cards", "⚙️ Settings"]).map((item, i) => (
                    <div key={i} style={{ padding: "7px 9px", borderRadius: 7, fontSize: 10, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? "#10B981" : "rgba(255,255,255,0.3)", background: i === 0 ? "rgba(16,185,129,0.1)" : "transparent", marginBottom: 3 }}>{item}</div>
                  ))}
                </div>
                <div style={{ flex: 1, padding: "16px" }}>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{lang === "de" ? "Guten Morgen" : "Good morning"}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{lang === "de" ? "Dein Unternehmen 👋" : "Your Business 👋"}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                    {[
                      { icon: "📈", label: lang === "de" ? "Umsatz" : "Revenue", value: "€4.280", change: "+23%", hi: true },
                      { icon: "👥", label: lang === "de" ? "Kunden" : "Customers", value: "847", change: "+18%", hi: false },
                      { icon: "💸", label: lang === "de" ? "Empfehlungen" : "Referrals", value: "234", change: "+31%", hi: true },
                      { icon: "💰", label: lang === "de" ? "Provision" : "Commission", value: "€1.120", change: "+21%", hi: false },
                    ].map((s, i) => (
                      <div key={i} style={{ background: s.hi ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)", border: activeTooltip === i ? "1.5px solid rgba(16,185,129,0.7)" : `1px solid ${s.hi ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, padding: "10px 11px", transition: "border-color 0.35s, box-shadow 0.35s", boxShadow: activeTooltip === i ? "0 0 14px rgba(16,185,129,0.25)" : "none" }}>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>{s.icon} {s.label}</div>
                        <div style={{ fontSize: 17, fontWeight: 900, color: "#fff" }}>{s.value}</div>
                        <div style={{ fontSize: 9, color: "#10B981", fontWeight: 600 }}>{s.change}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>{lang === "de" ? "Umsatz letzte 7 Tage" : "Revenue last 7 days"}</div>
                  <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 44, border: activeTooltip === 4 ? "1.5px solid rgba(16,185,129,0.5)" : "1.5px solid transparent", borderRadius: 8, padding: "0 4px", transition: "border-color 0.35s", boxShadow: activeTooltip === 4 ? "0 0 14px rgba(16,185,129,0.2)" : "none" }}>
                    {barHeights.map((h, i) => (
                      <div key={i} style={{ flex: 1, background: "linear-gradient(to top, #10B981, #34D399)", borderRadius: "3px 3px 0 0", height: `${h}%`, opacity: 0.55 + i * 0.06, transition: "height 1.8s cubic-bezier(0.34,1.56,0.64,1)" }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
              {tips.map((_, i) => (
                <div key={i} style={{ width: i === activeTooltip ? 20 : 6, height: 6, borderRadius: 100, background: i === activeTooltip ? "#10B981" : "rgba(255,255,255,0.15)", transition: "all 0.3s" }} />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{t.dash_scroll}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepsSlideSection({ lang, t }) {
  const steps = STEPS[lang];
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [hoveredStep, setHoveredStep] = useState(null);
  const stepRefs = useRef([]);

  useEffect(() => {
    const observers = steps.map((_, i) => {
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisibleSteps(prev => prev.includes(i) ? prev : [...prev, i]); }, { threshold: 0.2 });
      if (stepRefs.current[i]) obs.observe(stepRefs.current[i]);
      return obs;
    });
    return () => observers.forEach(o => o.disconnect());
  }, [lang]);

  return (
    <div id="how" style={{ padding: "80px 20px", background: "#0d1a10" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{t.how_label}</div>
          <h2 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, margin: "0 0 10px", color: "#fff" }}>{t.how_h2}</h2>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>{t.how_sub}</div>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 20, bottom: 20, width: 1, background: "linear-gradient(to bottom, rgba(16,185,129,0.4), rgba(16,185,129,0.05))", zIndex: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {steps.map((step, i) => {
              const isVisible = visibleSteps.includes(i);
              const isHovered = hoveredStep === i;
              return (
                <div key={step.num} ref={el => stepRefs.current[i] = el} onMouseEnter={() => setHoveredStep(i)} onMouseLeave={() => setHoveredStep(null)}
                  style={{ borderRadius: 20, overflow: "hidden", position: "relative", border: isHovered ? "1.5px solid rgba(16,185,129,0.7)" : isVisible ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(255,255,255,0.06)", minHeight: 130, opacity: isVisible ? 1 : 0, transform: isVisible ? (isHovered ? "translateX(6px) scale(1.01)" : "translateX(0)") : `translateX(${i % 2 === 0 ? "-60px" : "60px"})`, transition: `opacity 0.7s ease ${i * 0.06}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, box-shadow 0.3s`, boxShadow: isHovered ? "0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(16,185,129,0.2)" : isVisible ? "0 6px 24px rgba(0,0,0,0.3)" : "none", cursor: "default", zIndex: isHovered ? 2 : 1 }}>
                  <img src={step.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: isHovered ? 0.35 : 0.18, transform: isHovered ? "scale(1.04)" : "scale(1)", transition: "opacity 0.4s, transform 0.6s" }} />
                  <div style={{ position: "absolute", inset: 0, background: isHovered ? "rgba(8,20,10,0.5)" : "rgba(8,20,10,0.6)" }} />
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: isHovered ? "linear-gradient(90deg, #10B981, #34D399, #10B981)" : isVisible ? "linear-gradient(90deg, rgba(16,185,129,0.4), transparent)" : "transparent", transition: "background 0.3s" }} />
                  <div style={{ position: "relative", zIndex: 1, padding: "26px 28px", display: "flex", alignItems: "center", gap: 22 }}>
                    <div style={{ flexShrink: 0, textAlign: "center", width: 54 }}>
                      <div style={{ width: 54, height: 54, borderRadius: 16, background: isHovered ? "rgba(16,185,129,0.25)" : "rgba(16,185,129,0.12)", border: isHovered ? "2px solid rgba(16,185,129,0.8)" : "1.5px solid rgba(16,185,129,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isHovered ? 26 : 22, marginBottom: 6, boxShadow: isHovered ? "0 0 20px rgba(16,185,129,0.45)" : "none", transition: "all 0.3s" }}>{step.icon}</div>
                      <div style={{ fontSize: 11, fontWeight: 900, color: "#10B981" }}>{step.num}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, color: isHovered ? "#fff" : "rgba(255,255,255,0.9)", transition: "color 0.3s" }}>{step.title}</div>
                      <div style={{ fontSize: 13, color: isHovered ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)", lineHeight: 1.65, transition: "color 0.3s" }}>{step.desc}</div>
                    </div>
                    <div style={{ flexShrink: 0, fontSize: 20, color: "#10B981", opacity: isHovered ? 1 : 0, transform: isHovered ? "translateX(0)" : "translateX(-8px)", transition: "all 0.3s" }}>→</div>
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

function CtaForBusiness({ t }) {
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

  const lines = t.cta_h2.split("\n");

  return (
    <div ref={ref} style={{ position: "relative", overflow: "hidden", padding: "100px 32px", textAlign: "center" }}>
      <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1400&q=80" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "120%", objectFit: "cover", top: "-10%", transform: `translateY(${parallax}px)`, transition: "transform 0.05s linear", willChange: "transform" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(6,13,9,0.72)" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: "clamp(32px,6vw,60px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 16px", color: "#fff" }}>
          {lines[0]}<br /><span style={{ color: "#10B981" }}>{lines[1]}</span>
        </h2>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 36 }}>{t.cta_sub}</div>
        <Link to="/Business" style={{ display: "inline-block", background: "#10B981", color: "#fff", fontWeight: 800, fontSize: 17, padding: "18px 44px", borderRadius: 100, textDecoration: "none", animation: "bizCtaPulse 2.5s ease-in-out infinite" }}>
          {t.cta_btn}
        </Link>
      </div>
    </div>
  );
}

export default function ForBusiness() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem("sensalie_lang") || "de");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("sensalie_dark") !== "false");

  const t = T[lang];

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide(i => (i + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const toggleLang = () => {
    const next = lang === "de" ? "en" : "de";
    setLang(next);
    localStorage.setItem("sensalie_lang", next);
  };

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("sensalie_dark", String(next));
  };

  const bg = darkMode ? "#0a1410" : "#f0faf5";
  const textColor = darkMode ? "#fff" : "#0a1410";
  const navBg = darkMode ? "rgba(10,20,16,0.95)" : "rgba(240,250,245,0.97)";
  const borderColor = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Inter', sans-serif", color: textColor, overflowX: "clip", transition: "background 0.3s, color 0.3s" }}>
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
        @keyframes liveDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
        @media(max-width:640px){
          .biz-plans-grid { grid-template-columns: 1fr !important; }
          .biz-hero-btns { flex-direction: column !important; align-items: stretch !important; }
          .biz-nav-right { gap: 6px !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: navBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${borderColor}`, padding: "0 20px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background 0.3s" }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: textColor }}>Sensalie<span style={{ color: "#10B981" }}>.</span></div>
        <div className="biz-nav-right" style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={toggleLang} style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", border: `1px solid ${borderColor}`, borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: textColor, cursor: "pointer", fontFamily: "inherit" }}>
            {lang === "de" ? "🇬🇧 EN" : "🇩🇪 DE"}
          </button>
          <button onClick={toggleDark} style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", border: `1px solid ${borderColor}`, borderRadius: 8, padding: "6px 10px", fontSize: 15, cursor: "pointer", color: textColor }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
          <Link to="/Business" style={{ fontSize: 13, color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", textDecoration: "none", fontWeight: 500 }}>{t.nav_login}</Link>
          <Link to="/Business" style={{ background: "#10B981", color: "#fff", fontWeight: 700, fontSize: 13, padding: "9px 20px", borderRadius: 100, textDecoration: "none" }}>{t.nav_cta}</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {HERO_SLIDES.map((s, i) => (
          <div key={s.img} style={{ position: "absolute", inset: 0, transition: "opacity 1.5s ease", opacity: i === heroSlide ? 1 : 0 }}>
            <img src={s.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(8,15,11,0.72)" }} />
            <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700, color: "#10B981", whiteSpace: "nowrap" }}>
              ● {s.label[lang]}
            </div>
          </div>
        ))}
        <div style={{ position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto", padding: "100px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(36px, 7vw, 68px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 20px", color: "#fff" }}>
            {t.hero_h1.split("\n").map((line, i, arr) => (
              <span key={i}>{i === arr.length - 1 ? <span style={{ color: "#10B981" }}>{line}</span> : line}{i < arr.length - 1 ? <br /> : ""}</span>
            ))}
          </h1>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <WaitlistCounter lang={lang} />
          </div>

          <div className="biz-hero-btns" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/Business" style={{ background: "#10B981", color: "#fff", fontWeight: 800, fontSize: 16, padding: "16px 34px", borderRadius: 100, textDecoration: "none", boxShadow: "0 8px 30px rgba(16,185,129,0.4)" }}>
              {t.hero_cta}
            </Link>
            <a href="#how" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px 34px", borderRadius: 100, textDecoration: "none" }}>
              {t.hero_how}
            </a>
            <button onClick={() => setShowDemo(true)} style={{ background: "rgba(16,185,129,0.15)", border: "1.5px solid rgba(16,185,129,0.5)", color: "#10B981", fontWeight: 700, fontSize: 16, padding: "16px 34px", borderRadius: 100, cursor: "pointer", fontFamily: "inherit" }}>
              {t.hero_demo}
            </button>
          </div>
        </div>
      </div>

      <StatsSection lang={lang} t={t} />

      <VideoSection lang={lang} />

      <div style={{ background: "#0a1410" }}>
        <DashboardPreview lang={lang} t={t} />
      </div>

      <StepsSlideSection lang={lang} t={t} />

      {/* Pricing */}
      <div style={{ padding: "80px 24px", background: "#0a1410" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{t.price_label}</div>
            <h2 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, margin: "0 0 10px", color: "#fff" }}>{t.price_h2}</h2>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 20 }}>{t.price_sub}</div>
          </div>
          <div className="biz-plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "start" }}>
            {PLANS.map(plan => (
              <div key={plan.name} style={{ ...plan.cardStyle, borderRadius: 24, padding: "32px 22px", position: "relative", animation: plan.pulse === "green" ? "plusSwing 4s ease-in-out infinite" : plan.pulse === "amber" ? "proPulse 3.5s ease-in-out infinite" : "none" }}>
                {plan.badge && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: plan.badgeColor, borderRadius: 100, padding: "4px 16px", fontSize: 11, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }}>
                    {plan.badge[lang]}
                  </div>
                )}
                <div style={{ fontSize: 18, fontWeight: 900, color: plan.badge ? "#fff" : "rgba(255,255,255,0.6)", marginBottom: 6 }}>{plan.name}</div>
                {plan.regularPrice ? (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "line-through" }}>{plan.regularPrice}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: 40, fontWeight: 900, color: plan.pulse === "amber" ? "#F59E0B" : "#10B981" }}>{plan.price}</span>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{plan.period[lang]}</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                    <span style={{ fontSize: 40, fontWeight: 900, color: "rgba(255,255,255,0.5)" }}>{plan.price}</span>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                  {plan.features[lang].map((f, fi) => (
                    <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: f.ok ? (plan.badge ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)") : "rgba(255,255,255,0.22)", animation: `featureSlideIn 0.4s ease ${fi * 0.05}s both`, background: f.highlight ? "rgba(245,158,11,0.07)" : "transparent", border: f.highlight ? "1px solid rgba(245,158,11,0.2)" : "none", borderRadius: f.highlight ? 8 : 0, padding: f.highlight ? "5px 8px" : "0", marginLeft: f.highlight ? -8 : 0, marginRight: f.highlight ? -8 : 0 }}>
                      <span style={{ flexShrink: 0, fontWeight: 700, fontSize: 13, color: f.ok ? (f.highlight ? "#F59E0B" : plan.badge ? "#10B981" : "rgba(255,255,255,0.35)") : "#EF4444" }}>{f.ok ? "✓" : "✕"}</span>
                      {f.text}
                      {f.highlight && <span style={{ marginLeft: "auto", fontSize: 8, fontWeight: 800, color: "#F59E0B", background: "rgba(245,158,11,0.15)", borderRadius: 4, padding: "2px 5px", whiteSpace: "nowrap" }}>NEU</span>}
                    </div>
                  ))}
                </div>
                <button style={{ width: "100%", padding: "13px", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 800, ...plan.ctaStyle }}>
                  {plan.cta[lang]}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SocialProof />
      <FaqSection />

      <div style={{ padding: "0 24px 80px", background: "#0d1a10" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <WaitingListForm variant="business" />
        </div>
      </div>

      <CtaForBusiness t={t} />
      <SiteFooter />

      {showDemo && <DemoModal onClose={() => setShowDemo(false)} lang={lang} />}
    </div>
  );
}