import { useState, useEffect, useRef } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────────────
const USER = { name: "Max Mustermann", phone: "0151 234 567 89", avatar: "MM", since: "März 2026" };

const STAMP_CARDS = [
  {
    id: 1, name: "Kings Barbershop", emoji: "✂️", category: "Barbershop",
    stamps: 5, required: 8, reward: "10€ Gutschein",
    img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    color: "#10B981",
    appointment: { date: "Mo, 21. Apr.", time: "14:00 Uhr", confirmed: true },
  },
  {
    id: 2, name: "Café Milano", emoji: "☕", category: "Café",
    stamps: 3, required: 6, reward: "1 Kaffee gratis",
    img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
    color: "#F59E0B",
    appointment: null,
  },
  {
    id: 3, name: "Bella Nails", emoji: "💅", category: "Beauty",
    stamps: 7, required: 8, reward: "Maniküre gratis",
    img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
    color: "#EC4899",
    appointment: { date: "Do, 24. Apr.", time: "11:30 Uhr", confirmed: true },
  },
  {
    id: 4, name: "Massage Studio", emoji: "💆", category: "Wellness",
    stamps: 1, required: 10, reward: "1 Massage gratis",
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    color: "#8B5CF6",
    appointment: null,
  },
];

const REWARDS = [
  { id: 1, title: "10€ Gutschein", from: "Kings Barbershop", emoji: "✂️", expires: "30.06.2026", status: "bereit" },
  { id: 2, title: "Kaffee gratis", from: "Café Milano", emoji: "☕", expires: "15.05.2026", status: "bald" },
];

const REFERRAL_STATS = {
  code: "MAX2026",
  earned: 42.50,
  pending: 15.00,
  count: 3,
  history: [
    { name: "Sara K.", date: "10.04.2026", amount: 15.00, status: "ausstehend" },
    { name: "Jonas W.", date: "02.04.2026", amount: 12.50, status: "ausgezahlt" },
    { name: "Amir S.", date: "28.03.2026", amount: 15.00, status: "ausgezahlt" },
  ],
};

// ── Partner Businesses (Werbetreibende) ──────────────────────────────────────
const PARTNER_BUSINESSES = [
  {
    id: 1, name: "Kings Barbershop", emoji: "✂️", category: "Barbershop",
    img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    reward: "10€ Gutschein", provision: "15€ pro Empfehlung", color: "#10B981", type: "both",
  },
  {
    id: 2, name: "Café Milano", emoji: "☕", category: "Café",
    img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
    reward: "1 Kaffee gratis", provision: "8€ pro Empfehlung", color: "#F59E0B", type: "both",
  },
  {
    id: 3, name: "Bella Nails", emoji: "💅", category: "Nagelstudio",
    img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
    reward: "Maniküre gratis", provision: "12€ pro Empfehlung", color: "#EC4899", type: "both",
  },
  {
    id: 4, name: "Lotus Massage", emoji: "💆", category: "Massage",
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    reward: "1 Massage gratis", provision: "18€ pro Empfehlung", color: "#8B5CF6", type: "both",
  },
  {
    id: 5, name: "Sushi Lounge", emoji: "🍱", category: "Restaurant",
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
    reward: "1 Rolle gratis", provision: "10€ pro Empfehlung", color: "#06B6D4", type: "both",
  },
  {
    id: 6, name: "Glam Studio", emoji: "💄", category: "Beauty",
    img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    reward: "Styling gratis", provision: "14€ pro Empfehlung", color: "#F472B6", type: "both",
  },
  {
    id: 7, name: "Barber Club", emoji: "🪒", category: "Barbershop",
    img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
    reward: "1 Rasur gratis", provision: "12€ pro Empfehlung", color: "#34D399", type: "both",
  },
  {
    id: 8, name: "Pizza Roma", emoji: "🍕", category: "Restaurant",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    reward: "1 Pizza gratis", provision: "8€ pro Empfehlung", color: "#FB923C", type: "both",
  },
  {
    id: 9, name: "Wellness Oase", emoji: "🧖", category: "Wellness",
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    reward: "Gesichtsmaske gratis", provision: "20€ pro Empfehlung", color: "#A78BFA", type: "both",
  },
  {
    id: 10, name: "Hair & Style", emoji: "💇", category: "Friseur",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    reward: "Haarschnitt gratis", provision: "10€ pro Empfehlung", color: "#38BDF8", type: "both",
  },
];

const ACTIVITY = [
  { icon: "✂️", text: "Stempel bei Kings Barbershop", time: "Heute, 14:32", type: "stamp" },
  { icon: "💅", text: "Stempel bei Bella Nails", time: "Gestern, 11:05", type: "stamp" },
  { icon: "💸", text: "12,50€ Provision erhalten", time: "02.04.2026", type: "reward" },
  { icon: "✂️", text: "Stempel bei Kings Barbershop", time: "28.03.2026", type: "stamp" },
];

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "home",      icon: "▦",  label: "Übersicht" },
  { id: "cards",     icon: "◈",  label: "Karten" },
  { id: "rewards",   icon: "⬡",  label: "Prämien" },
  { id: "referral",  icon: "◎",  label: "Empfehlen" },
  { id: "analytics", icon: "📈", label: "Analyse", comingSoon: true },
];

// ── Locked Analytics Chart ────────────────────────────────────────────────────
const CHART_POINTS = [
  { month: "Jan", saved: 0, earned: 0 },
  { month: "Feb", saved: 8, earned: 0 },
  { month: "Mär", saved: 8, earned: 12.5 },
  { month: "Apr", saved: 34, earned: 42.5 },
];

function LockedAnalyticsChart() {
  const [showModal, setShowModal] = useState(false);
  const W = 280, H = 90, pad = 10;
  const maxVal = 50;

  // Convert data points to SVG path
  const toX = (i) => pad + (i / (CHART_POINTS.length - 1)) * (W - pad * 2);
  const toY = (v) => H - pad - (v / maxVal) * (H - pad * 2);

  const pathSaved = CHART_POINTS.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(d.saved)}`).join(" ");
  const pathEarned = CHART_POINTS.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(d.earned)}`).join(" ");

  return (
    <>
      <div style={{ position: "relative" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>📈</span>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 900, color: "#fff" }}>Mein Verlauf</span>
          </div>
          <div style={{ background: "rgba(168,85,247,0.18)", border: "1px solid rgba(168,85,247,0.45)", borderRadius: 100, padding: "3px 10px", fontSize: 9, fontWeight: 800, color: "#C084FC" }}>
            PLUS
          </div>
        </div>

        {/* Chart card */}
        <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", background: "linear-gradient(160deg, #0d1a26, #111e28)", border: "1px solid rgba(255,255,255,0.07)", padding: "16px 16px 12px" }}>
          {/* Legend */}
          <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 18, height: 2, background: "#10B981", borderRadius: 2 }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Gespart</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 18, height: 2, background: "#EC4899", borderRadius: 2 }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Verdient</span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
              <line key={i} x1={pad} y1={toY(t * maxVal)} x2={W - pad} y2={toY(t * maxVal)}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}
            {/* Saved area fill */}
            <path d={`${pathSaved} L ${toX(CHART_POINTS.length - 1)} ${H - pad} L ${toX(0)} ${H - pad} Z`}
              fill="url(#savedGrad)" opacity="0.3" />
            {/* Earned area fill */}
            <path d={`${pathEarned} L ${toX(CHART_POINTS.length - 1)} ${H - pad} L ${toX(0)} ${H - pad} Z`}
              fill="url(#earnedGrad)" opacity="0.3" />
            {/* Lines */}
            <path d={pathSaved} fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d={pathEarned} fill="none" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dots */}
            {CHART_POINTS.map((d, i) => (
              <g key={i}>
                <circle cx={toX(i)} cy={toY(d.saved)} r="3" fill="#10B981" />
                <circle cx={toX(i)} cy={toY(d.earned)} r="3" fill="#EC4899" />
              </g>
            ))}
            {/* Month labels */}
            {CHART_POINTS.map((d, i) => (
              <text key={i} x={toX(i)} y={H} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.3)">{d.month}</text>
            ))}
            <defs>
              <linearGradient id="savedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" /><stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="earnedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EC4899" /><stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Lock overlay */}
          <div onClick={() => setShowModal(true)} style={{
            position: "absolute", inset: 0, borderRadius: 20,
            background: "rgba(10,15,22,0.55)", backdropFilter: "blur(3px)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
            cursor: "pointer",
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(168,85,247,0.2)", border: "1.5px solid rgba(168,85,247,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="18" viewBox="0 0 22 24" fill="none">
                <rect x="2" y="10" width="18" height="13" rx="4" fill="rgba(168,85,247,0.35)" stroke="#C084FC" strokeWidth="1.5"/>
                <path d="M6 10V7a5 5 0 0 1 10 0v3" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="11" cy="16.5" r="2" fill="#C084FC"/>
              </svg>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C084FC" }}>Sensalie Plus freischalten</div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 600, background: "#111e28", borderRadius: "28px 28px 0 0", border: "1px solid rgba(168,85,247,0.2)", borderBottom: "none", padding: "24px 24px 48px" }}>
            <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 100, margin: "0 auto 20px" }} />
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📈</div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 6 }}>Detaillierte Analyse</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>Sieh genau, wie viel du pro Monat sparst und verdienst — mit Sensalie Plus.</div>
            </div>
            <div style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", borderRadius: 16, padding: "16px 18px", marginBottom: 16 }}>
              {["Vollständige Sparübersicht", "Monatliche Verdienstanalyse", "Empfehlungs-Statistiken"].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                  <span style={{ color: "#C084FC" }}>✦</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.1))", border: "1.5px solid rgba(168,85,247,0.4)", borderRadius: 14, padding: "14px", textAlign: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#C084FC", fontFamily: "'Bricolage Grotesque', sans-serif" }}>Sensalie Plus · 1,99 € / Monat</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Bald verfügbar</div>
            </div>
            <button onClick={() => setShowModal(false)} style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "none", borderRadius: 12, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              Schließen
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── StampDots ─────────────────────────────────────────────────────────────────
function StampDots({ stamps = 0, required = 8, color = "#10B981" }) {
  const safeRequired = Math.max(1, Math.floor(Number(required) || 8));
  const safeStamps = Math.max(0, Math.floor(Number(stamps) || 0));
  const safeColor = color || "#10B981";
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(safeRequired, 8)}, 1fr)`, gap: 5 }}>
      {Array.from({ length: safeRequired }, (_, i) => (
        <div key={i} style={{
          width: "100%", aspectRatio: "1/1", borderRadius: 6,
          background: i < safeStamps ? safeColor : "rgba(255,255,255,0.07)",
          border: i < safeStamps ? "none" : "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, color: "#fff", fontWeight: 700,
          boxShadow: i === safeStamps - 1 ? `0 0 10px ${safeColor}88` : "none",
          transition: "all 0.3s",
        }}>
          {i < safeStamps ? "✓" : ""}
        </div>
      ))}
    </div>
  );
}

// ── StampCard ─────────────────────────────────────────────────────────────────
function StampCard({ card, compact = false, onBookAppointment }) {
  const pct = Math.round((card.stamps / card.required) * 100);
  const isAlmostDone = card.stamps >= card.required - 1;

  return (
    <div style={{
      borderRadius: 20,
      overflow: "hidden",
      position: "relative",
      background: "#1a2530",
      border: isAlmostDone ? `1.5px solid ${card.color}` : "1px solid rgba(255,255,255,0.07)",
      boxShadow: isAlmostDone ? `0 4px 24px ${card.color}33` : "none",
    }}>
      {/* Background image */}
      <div style={{ position: "relative", height: compact ? 80 : 110 }}>
        <img src={card.img} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(26,37,48,0.3) 0%, rgba(26,37,48,0.9) 100%)" }} />
        {isAlmostDone && (
          <div style={{ position: "absolute", top: 10, right: 12, background: card.color, borderRadius: 8, padding: "3px 10px", fontSize: 10, fontWeight: 800, color: "#fff" }}>
            Fast da! 🎉
          </div>
        )}
        <div style={{ position: "absolute", bottom: 10, left: 14, display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 18 }}>{card.emoji}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>{card.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>{card.category}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 14px 16px" }}>
        {/* Progress bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Fortschritt</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: card.color }}>{card.stamps}/{card.required}</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 100, height: 5, marginBottom: 12, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${card.color}88, ${card.color})`, borderRadius: 100, transition: "width 0.6s ease" }} />
        </div>

        {!compact && <StampDots stamps={card.stamps} required={card.required} color={card.color} />}

        {/* Reward + Appointment row */}
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: card.color, fontWeight: 600 }}>🎁 {card.reward}</div>
          {card.appointment ? (
            <div onClick={() => onBookAppointment && onBookAppointment(card)} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "4px 8px", cursor: "pointer" }}>
              <span style={{ fontSize: 9 }}>📅</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{card.appointment.date} · {card.appointment.time}</span>
            </div>
          ) : (
            <button onClick={() => onBookAppointment && onBookAppointment(card)} style={{ background: `${card.color}22`, border: `1px solid ${card.color}44`, borderRadius: 8, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: card.color, cursor: "pointer", fontFamily: "inherit" }}>
              + Termin
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Partner Showcase — langsam scrollende Branchen-Bilder ───────────────────
const SHOWCASE_SLIDES = [
  { img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80", label: "Barbershops", emoji: "✂️" },
  { img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80", label: "Pizzerien", emoji: "🍕" },
  { img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80", label: "Cafés", emoji: "☕" },
  { img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80", label: "Nagelstudios", emoji: "💅" },
  { img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80", label: "Friseursalons", emoji: "💇" },
  { img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", label: "Massage", emoji: "💆" },
  { img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80", label: "Beauty Studios", emoji: "💄" },
  { img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80", label: "Restaurants", emoji: "🍱" },
];

function PartnerShowcase() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveSlide(i => (i + 1) % SHOWCASE_SLIDES.length), 3000);
    return () => clearInterval(t);
  }, []);

  const slide = SHOWCASE_SLIDES[activeSlide];

  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: 100 }}>
      {/* Slides */}
      {SHOWCASE_SLIDES.map((s, i) => (
        <img
          key={s.img}
          src={s.img}
          alt={s.label}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            opacity: i === activeSlide ? 1 : 0,
            transition: "opacity 1.2s ease",
          }}
        />
      ))}
      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(17,30,40,0.2) 0%, rgba(17,30,40,0.85) 100%)" }} />

      {/* Coming Soon badge */}
      <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(168,85,247,0.25)", border: "1px solid rgba(168,85,247,0.5)", borderRadius: 100, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
        <svg width="10" height="12" viewBox="0 0 12 14" fill="none">
          <rect x="1" y="6" width="10" height="7" rx="2" fill="rgba(192,132,252,0.4)" stroke="#C084FC" strokeWidth="1.2"/>
          <path d="M3 6V4a3 3 0 0 1 6 0v2" stroke="#C084FC" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 9, fontWeight: 800, color: "#C084FC" }}>DEMNÄCHST</span>
      </div>

      {/* Label */}
      <div style={{ position: "absolute", bottom: 12, left: 14, right: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 2 }}>Bald bei Sensalie</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>{slide.emoji}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{slide.label}</span>
          </div>
        </div>
        {/* Dot indicators */}
        <div style={{ display: "flex", gap: 4 }}>
          {SHOWCASE_SLIDES.map((_, i) => (
            <div key={i} onClick={() => setActiveSlide(i)} style={{ width: 5, height: 5, borderRadius: "50%", background: i === activeSlide ? "#10B981" : "rgba(255,255,255,0.25)", transition: "background 0.4s", cursor: "pointer" }} />
          ))}
        </div>
      </div>

      {/* Info strip */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(16,185,129,0.08)", borderTop: "1px solid rgba(16,185,129,0.15)", padding: "0" }}>
      </div>
    </div>
  );
}

// ── Appointment Booking Modal ────────────────────────────────────────────────
const MOCK_SLOTS = ["09:00", "10:00", "11:00", "11:30", "14:00", "15:00", "16:30", "17:00"];
const MOCK_DATES = [
  { label: "Mo, 21. Apr.", short: "Mo" },
  { label: "Di, 22. Apr.", short: "Di" },
  { label: "Mi, 23. Apr.", short: "Mi" },
  { label: "Do, 24. Apr.", short: "Do" },
  { label: "Fr, 25. Apr.", short: "Fr" },
];

function AppointmentModal({ card, onClose, onBook }) {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);
  const [booked, setBooked] = useState(false);

  const handleBook = () => {
    if (!selectedTime) return;
    setBooked(true);
    setTimeout(() => {
      onBook(card.id, { date: MOCK_DATES[selectedDate].label, time: selectedTime + " Uhr", confirmed: true });
      onClose();
    }, 1200);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 600, background: "#111e28", borderRadius: "28px 28px 0 0", border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none", padding: "24px 24px 48px", boxShadow: "0 -20px 60px rgba(0,0,0,0.6)" }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 100, margin: "0 auto 20px" }} />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, background: `${card.color}22`, border: `1px solid ${card.color}55`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{card.emoji}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>Termin buchen</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{card.name}</div>
          </div>
        </div>

        {/* Date picker */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Datum wählen</div>
          <div style={{ display: "flex", gap: 8 }}>
            {MOCK_DATES.map((d, i) => (
              <button key={i} onClick={() => { setSelectedDate(i); setSelectedTime(null); }} style={{ flex: 1, padding: "10px 4px", background: selectedDate === i ? card.color : "rgba(255,255,255,0.06)", border: selectedDate === i ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: 12, cursor: "pointer", fontFamily: "inherit" }}>
                <div style={{ fontSize: 10, color: selectedDate === i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)", marginBottom: 2 }}>{d.short}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: selectedDate === i ? "#fff" : "rgba(255,255,255,0.6)" }}>{d.label.split(". ")[1]?.replace("Apr", "").trim() || d.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time slots */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Uhrzeit wählen</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {MOCK_SLOTS.map(slot => (
              <button key={slot} onClick={() => setSelectedTime(slot)} style={{ padding: "10px 6px", background: selectedTime === slot ? card.color : "rgba(255,255,255,0.06)", border: selectedTime === slot ? "none" : "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 13, fontWeight: 700, color: selectedTime === slot ? "#fff" : "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "inherit" }}>
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Book button */}
        <button onClick={handleBook} disabled={!selectedTime || booked} style={{ width: "100%", padding: "14px", background: booked ? "#059669" : (!selectedTime ? "rgba(255,255,255,0.08)" : card.color), color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: selectedTime && !booked ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "all 0.3s" }}>
          {booked ? "✓ Termin bestätigt!" : selectedTime ? `Termin buchen — ${MOCK_DATES[selectedDate].label} ${selectedTime}` : "Uhrzeit auswählen"}
        </button>
      </div>
    </div>
  );
}

// ── Provision Widget ──────────────────────────────────────────────────────────
function ProvisionWidget() {
  const refLink = `sensalie.app/ref/${REFERRAL_STATS.code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&bgcolor=0d1f14&color=63FFB4&qzone=1&data=${encodeURIComponent("https://" + refLink)}`;

  const handleShare = () => {
    navigator.clipboard.writeText("https://" + refLink);
  };

  return (
    <div style={{
      borderRadius: 16, overflow: "hidden", position: "relative",
      background: "linear-gradient(135deg, #0d1f14, #0f2d1f)",
      border: "1.5px solid rgba(16,185,129,0.25)",
      padding: "14px 14px",
    }}>
      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Deine Provision</div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {/* Stats */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "8px 10px" }}>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 900, color: "#10B981" }}>{REFERRAL_STATS.earned.toFixed(0)}€</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>Verdient</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "8px 10px" }}>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 900, color: "#F59E0B" }}>{REFERRAL_STATS.pending.toFixed(0)}€</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>Ausstehend</div>
            </div>
          </div>
          <button onClick={handleShare} style={{ width: "100%", padding: "8px", background: "linear-gradient(135deg, #10B981, #059669)", color: "#fff", border: "none", borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
            💬 Link teilen
          </button>
        </div>
        {/* QR Code */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ background: "#0d1f14", border: "1px solid rgba(99,255,180,0.3)", borderRadius: 10, padding: 6 }}>
            <img src={qrUrl} alt="Empfehlungs-QR" style={{ width: 72, height: 72, display: "block", borderRadius: 6 }} />
          </div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>Scan zum Teilen</div>
        </div>
      </div>
    </div>
  );
}

// ── Rangliste Coming Soon — horizontal bar style ──────────────────────────────
const LEADERBOARD = [
  { rank: 1, medal: "🥇", name: "Mehmet B.", pts: 842, prize: "100€", pct: 100, color: "#F59E0B" },
  { rank: 2, medal: "🥈", name: "Sara K.",   pts: 791, prize: "50€",  pct: 94,  color: "#94A3B8" },
  { rank: 3, medal: "🥉", name: "Jonas W.",  pts: 723, prize: "25€",  pct: 86,  color: "#CD7F32" },
  { rank: 4, medal: "4",  name: "Fatima A.", pts: 610, prize: "10€",  pct: 72,  color: "#8B5CF6" },
  { rank: 5, medal: "5",  name: "Du?",       pts: null, prize: "—",   pct: 0,   color: "#C084FC", isYou: true },
];

function RankingComingSoon() {
  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🏆</span>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 900, color: "#fff" }}>Rangliste</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>· jedes Halbjahr</span>
        </div>
        <div style={{ background: "rgba(168,85,247,0.18)", border: "1px solid rgba(168,85,247,0.45)", borderRadius: 100, padding: "3px 10px", fontSize: 9, fontWeight: 800, color: "#C084FC" }}>
          COMING SOON
        </div>
      </div>

      <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", background: "linear-gradient(160deg, #16102a, #1e1540)", border: "1px solid rgba(168,85,247,0.2)", padding: "16px 16px" }}>

        {/* Top 3 — horizontal bar chart rising upwards */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 10, height: 110, marginBottom: 14, paddingBottom: 4, borderBottom: "1px solid rgba(168,85,247,0.1)" }}>
          {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((e, i) => {
            const barHeights = [78, 100, 60];
            const barH = barHeights[i];
            return (
              <div key={e.rank} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
                {/* medal above bar */}
                <div style={{ fontSize: i === 1 ? 18 : 14 }}>{e.medal}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: e.color }}>{e.pts} Pkt.</div>
                {/* The bar itself */}
                <div style={{
                  width: "100%", height: barH,
                  borderRadius: "10px 10px 0 0",
                  background: `linear-gradient(to top, ${e.color}88, ${e.color}22)`,
                  border: `1px solid ${e.color}55`,
                  display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6,
                }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: e.color }}>{e.prize}</span>
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", textAlign: "center", marginTop: 2, maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div>
              </div>
            );
          })}
        </div>

        {/* Rank 4 & 5 as simple rows */}
        {LEADERBOARD.slice(3).map((entry, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 4px",
            background: entry.isYou ? "rgba(168,85,247,0.1)" : "transparent",
            borderRadius: 10,
            borderBottom: i < 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
          }}>
            <div style={{ width: 20, textAlign: "center", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)" }}>{entry.rank}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: entry.isYou ? 800 : 600, color: entry.isYou ? "#C084FC" : "#fff" }}>{entry.name}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{entry.pts ? `${entry.pts} Pkt.` : "—"}</span>
              </div>
              <div style={{ height: 4, borderRadius: 100, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${entry.pct}%`, background: `linear-gradient(90deg, ${entry.color}55, ${entry.color})`, borderRadius: 100 }} />
              </div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.2)", minWidth: 28, textAlign: "right" }}>{entry.prize}</div>
          </div>
        ))}

        {/* Lock overlay — lighter blur so bars show through */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 20,
          background: "rgba(13,10,25,0.45)",
          backdropFilter: "blur(2px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(168,85,247,0.2)", border: "1.5px solid rgba(168,85,247,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="22" viewBox="0 0 22 24" fill="none">
              <rect x="2" y="10" width="18" height="13" rx="4" fill="rgba(168,85,247,0.35)" stroke="#C084FC" strokeWidth="1.5"/>
              <path d="M6 10V7a5 5 0 0 1 10 0v3" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="11" cy="16.5" r="2" fill="#C084FC"/>
            </svg>
          </div>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, fontWeight: 900, color: "#fff" }}>Kommt bald</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textAlign: "center", maxWidth: 160, lineHeight: 1.5 }}>Jedes Halbjahr gewinnen die Aktivsten echte Preise</div>
        </div>
      </div>
    </div>
  );
}

// ── Home Tab ──────────────────────────────────────────────────────────────────
function HomeTab({ onTabChange, appointments, onBookAppointment }) {
  const [activityExpanded, setActivityExpanded] = useState(false);
  const visibleActivity = activityExpanded ? ACTIVITY : ACTIVITY.slice(0, 2);
  const upcomingAppointments = STAMP_CARDS.filter(c => appointments[c.id])
    .map(c => ({ ...c, appointment: appointments[c.id] }))
    .sort((a, b) => a.appointment.date.localeCompare(b.appointment.date));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero greeting */}
      <div style={{
        borderRadius: 24, overflow: "hidden", position: "relative",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        padding: "22px 22px",
      }}>
        <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 220, height: 220, background: "radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Willkommen zurück 👋</div>
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 10 }}>{USER.name.split(" ")[0]}</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 0 }}>
          <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "8px 14px" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#10B981" }}>34€</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>mit Sensalie gespart</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "8px 14px" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#F59E0B" }}>{STAMP_CARDS.length}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>Aktive Karten</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "8px 14px" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#EC4899" }}>{REFERRAL_STATS.earned.toFixed(0)}€</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>Verdient</div>
          </div>
        </div>
      </div>

      {/* Partner Showcase */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Partnerbetriebe</div>
        <PartnerShowcase />
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Deine Termine 📅</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcomingAppointments.map(card => (
              <div key={card.id} onClick={() => onBookAppointment(card)} style={{ display: "flex", alignItems: "center", gap: 12, background: "#1a2530", border: `1px solid ${card.color}33`, borderRadius: 16, padding: "12px 14px", cursor: "pointer" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                  <img src={card.img} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{card.name}</div>
                  <div style={{ fontSize: 11, color: card.color, fontWeight: 600, marginTop: 2 }}>📅 {card.appointment.date} · {card.appointment.time}</div>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>ändern →</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provision Widget */}
      <ProvisionWidget />

      {/* Almost done card */}
      {STAMP_CARDS.filter(c => c.stamps >= c.required - 1).length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Fast geschafft 🔥</div>
          {STAMP_CARDS.filter(c => c.stamps >= c.required - 1).map(card => (
            <StampCard key={card.id} card={{ ...card, appointment: appointments[card.id] || card.appointment }} compact onBookAppointment={onBookAppointment} />
          ))}
        </div>
      )}

      {/* Ready rewards */}
      {REWARDS.filter(r => r.status === "bereit").length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Prämie einlösbar 🎁</div>
          {REWARDS.filter(r => r.status === "bereit").map(r => (
            <div key={r.id} style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))", border: "1.5px solid rgba(16,185,129,0.35)", borderRadius: 18, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 28 }}>{r.emoji}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>von {r.from} · bis {r.expires}</div>
                </div>
              </div>
              <button style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Einlösen</button>
            </div>
          ))}
        </div>
      )}

      {/* Activity — collapsed to 2, expandable */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase" }}>Letzte Aktivität</div>
        </div>
        <div style={{ background: "#1a2530", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
          {visibleActivity.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ width: 36, height: 36, background: a.type === "reward" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{a.text}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
          {/* Expand / collapse button */}
          <button onClick={() => setActivityExpanded(v => !v)} style={{
            width: "100%", padding: "11px", background: "transparent", border: "none",
            color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          }}>
            {activityExpanded ? "▲ Weniger anzeigen" : `▼ Alle ${ACTIVITY.length} Aktivitäten`}
          </button>
        </div>
      </div>

      {/* Rangliste */}
      <RankingComingSoon />
    </div>
  );
}

// ── Cards Tab ──────────────────────────────────────────────────────────────────
function CardsTab({ appointments, onBookAppointment }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Deine {STAMP_CARDS.length} Stempelkarten</div>
      {STAMP_CARDS.map(card => (
        <StampCard
          key={card.id}
          card={{ ...card, appointment: appointments[card.id] || card.appointment }}
          onBookAppointment={onBookAppointment}
        />
      ))}
    </div>
  );
}

// ── Rewards Tab ────────────────────────────────────────────────────────────────
function RewardsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Deine Prämien</div>
      {REWARDS.map(r => (
        <div key={r.id} style={{
          background: "#1a2530", border: r.status === "bereit" ? "1.5px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.07)",
          borderRadius: 20, overflow: "hidden",
          boxShadow: r.status === "bereit" ? "0 4px 20px rgba(16,185,129,0.15)" : "none",
        }}>
          <div style={{ padding: "20px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 48, height: 48, background: r.status === "bereit" ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{r.emoji}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>von {r.from}</div>
                </div>
              </div>
              <div style={{
                padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                background: r.status === "bereit" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                color: r.status === "bereit" ? "#10B981" : "#F59E0B",
              }}>
                {r.status === "bereit" ? "✓ Bereit" : "⏳ Bald"}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Gültig bis {r.expires}</div>
              {r.status === "bereit" && (
                <button style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Jetzt einlösen →
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      {/* Empty state for future rewards */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🎯</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Weitere Prämien freischalten</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.5 }}>Sammle weiter Stempel und sichere dir mehr Belohnungen</div>
      </div>
    </div>
  );
}

// ── Referral Tab ───────────────────────────────────────────────────────────────
function ReferralTab() {
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [showAllBiz, setShowAllBiz] = useState(false);

  const refLink = `https://sensalie.app/ref/${REFERRAL_STATS.code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=0d2137&color=63FFB4&qzone=2&data=${encodeURIComponent(refLink)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const msg = `Hey! Schau dir mal Sensalie an – einfach über meinen Link registrieren und Stempel sammeln 🎁\n${refLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const shareGeneric = () => {
    copyLink();
  };

  const referrablePartners = PARTNER_BUSINESSES.filter(b => b.provision);
  const filtered = search.trim()
    ? referrablePartners.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase()))
    : referrablePartners;

  const handleShareBiz = (biz) => {
    const msg = `Hey! Ich empfehle dir ${biz.name} auf Sensalie – einfach über meinen Link registrieren: ${refLink} 💸`;
    navigator.clipboard.writeText(msg);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Earnings overview */}
      <div style={{ borderRadius: 20, background: "linear-gradient(135deg, #0d2137, #1a3a4a)", border: "1px solid rgba(99,255,180,0.15)", padding: "18px 18px" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>Deine Einnahmen</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 900, color: "#10B981" }}>{REFERRAL_STATS.earned.toFixed(2)}€</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Gesamt verdient</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 900, color: "#F59E0B" }}>{REFERRAL_STATS.pending.toFixed(2)}€</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Ausstehend</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 900, color: "#EC4899" }}>{REFERRAL_STATS.count}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Empfehlungen</div>
          </div>
        </div>

        {/* QR + Link row */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,255,180,0.15)", borderRadius: 14, padding: "12px 14px" }}>
          <div style={{ background: "#0d2137", border: "1px solid rgba(99,255,180,0.3)", borderRadius: 10, padding: 6, flexShrink: 0 }}>
            <img src={qrUrl} alt="Referral QR" style={{ width: 64, height: 64, display: "block", borderRadius: 6 }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>Dein persönlicher Link</div>
            <div style={{ fontSize: 11, color: "#63FFB4", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 8 }}>{refLink}</div>
            <button onClick={copyLink} style={{ background: copied ? "#10B981" : "rgba(16,185,129,0.15)", color: copied ? "#fff" : "#10B981", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.3s" }}>
              {copied ? "✓ Kopiert!" : "🔗 Link kopieren"}
            </button>
          </div>
        </div>
      </div>

      {/* Share buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={shareWhatsApp} style={{ flex: 1, padding: "13px", background: "linear-gradient(135deg, #25D366, #128C7E)", color: "#fff", border: "none", borderRadius: 14, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
          💬 WhatsApp
        </button>
        <button onClick={shareGeneric} style={{ flex: 1, padding: "13px", background: "linear-gradient(135deg, #10B981, #059669)", color: "#fff", border: "none", borderRadius: 14, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
          ↗ Link teilen
        </button>
      </div>

      {/* Partner businesses to recommend */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Unternehmen empfehlen 💸</div>
        {/* Search */}
        <div style={{ position: "relative", marginBottom: 12 }}>
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "rgba(255,255,255,0.25)" }}>🔍</span>
          <input
            type="text"
            placeholder="Geschäft suchen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "11px 14px 11px 38px",
              background: "#1a2530", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, fontSize: 13, color: "#fff",
              fontFamily: "inherit", outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>Keine Ergebnisse für „{search}"</div>
          )}
          {(showAllBiz || search ? filtered : filtered.slice(0, 5)).map(biz => (
            <div key={biz.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#1a2530", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ width: 60, height: 60, flexShrink: 0, position: "relative" }}>
                <img src={biz.img} alt={biz.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
                <div style={{ position: "absolute", bottom: 3, left: 0, right: 0, textAlign: "center", fontSize: 14 }}>{biz.emoji}</div>
              </div>
              <div style={{ flex: 1, paddingRight: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{biz.name}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{biz.category}</div>
                <div style={{ fontSize: 11, color: "#63FFB4", fontWeight: 700, marginTop: 3 }}>💸 {biz.provision}</div>
              </div>
              <button onClick={() => handleShareBiz(biz)} style={{ marginRight: 12, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", borderRadius: 10, padding: "7px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                Teilen →
              </button>
            </div>
          ))}
          {/* Show more / less button */}
          {!search && filtered.length > 5 && (
            <button onClick={() => setShowAllBiz(v => !v)} style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}>
              {showAllBiz ? "▲ Weniger anzeigen" : `▼ Alle ${filtered.length} Unternehmen zeigen`}
            </button>
          )}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: "#1a2530", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "18px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 14 }}>So verdienst du Geld</div>
        {[
          { icon: "1️⃣", text: "Teile deinen persönlichen Link per WhatsApp oder direkt" },
          { icon: "2️⃣", text: "Dein Freund öffnet den Link, besucht das Geschäft & sammelt Stempel" },
          { icon: "3️⃣", text: "Sobald er den Mindestumsatz erreicht, wird deine Provision automatisch freigeschaltet" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: i < 2 ? 12 : 0 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{s.text}</span>
          </div>
        ))}
      </div>

      {/* History */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Empfehlungsverlauf</div>
        <div style={{ background: "#1a2530", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
          {REFERRAL_STATS.history.map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: i < REFERRAL_STATS.history.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, background: "rgba(255,255,255,0.05)", borderRadius: 50, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>{h.name.split(" ").map(n => n[0]).join("")}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{h.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{h.date}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#10B981" }}>+{h.amount.toFixed(2)}€</div>
                <div style={{ fontSize: 10, color: h.status === "ausgezahlt" ? "rgba(16,185,129,0.6)" : "rgba(245,158,11,0.7)", marginTop: 2 }}>{h.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── QR Modal ──────────────────────────────────────────────────────────────────
function QRModal({ onClose }) {
  // Personal QR code — the cashier scans this
  const qrData = `sensalie://stamp?user=${USER.phone.replace(/\s/g, "")}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&bgcolor=111e28&color=10B981&qzone=2&data=${encodeURIComponent(qrData)}`;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 600,
        background: "#111e28",
        borderRadius: "28px 28px 0 0",
        border: "1px solid rgba(255,255,255,0.1)",
        borderBottom: "none",
        padding: "24px 28px 48px",
        boxShadow: "0 -20px 60px rgba(0,0,0,0.6)",
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 100, margin: "0 auto 24px" }} />

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 900, color: "#fff" }}>Dein Stempel-QR-Code</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>Zeige diesen Code an der Kasse — der Kassierer scannt ihn</div>
        </div>

        {/* QR Code */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(16,185,129,0.25)",
          borderRadius: 24, padding: "28px 20px", margin: "20px 0",
        }}>
          <div style={{
            background: "#111e28", borderRadius: 16, padding: 14,
            boxShadow: "0 0 40px rgba(16,185,129,0.2)",
            border: "1px solid rgba(16,185,129,0.15)",
          }}>
            <img src={qrUrl} alt="QR Code" style={{ width: 200, height: 200, display: "block", borderRadius: 8 }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>Verknüpft mit</div>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 800, color: "#63FFB4" }}>{USER.phone}</div>
          </div>
        </div>

        {/* Info row */}
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { icon: "📍", text: "An der Kasse zeigen" },
            { icon: "⚡", text: "Sekunden dauert es" },
            { icon: "✅", text: "Stempel automatisch" },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "10px 6px" }}>
              <div style={{ fontSize: 16, marginBottom: 4 }}>{item.icon}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function CustomerDashboard() {
  const [tab, setTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [bookingCard, setBookingCard] = useState(null);

  // appointments: { [cardId]: { date, time, confirmed } }
  const initialAppointments = {};
  STAMP_CARDS.forEach(c => { if (c.appointment) initialAppointments[c.id] = c.appointment; });
  const [appointments, setAppointments] = useState(initialAppointments);

  const handleBookAppointment = (card) => setBookingCard(card);
  const handleConfirmBooking = (cardId, appt) => {
    setAppointments(prev => ({ ...prev, [cardId]: appt }));
    setBookingCard(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#111e28", fontFamily: "'Inter', sans-serif", color: "#fff", overflowX: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Bricolage+Grotesque:wght@700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>

      {/* BG glow */}
      <div style={{ position: "fixed", top: "-20%", left: "-10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "5%", right: "-10%", width: 300, height: 300, background: "radial-gradient(circle, rgba(99,130,255,0.08) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />

      {/* ── Header ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(17,30,40,0.9)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 20px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff" }}>
              {USER.avatar}
            </div>
            <div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, fontWeight: 800, color: "#fff" }}>{USER.name}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Mitglied seit {USER.since}</div>
            </div>
          </div>
          {/* Hamburger menu */}
          <button onClick={() => setMenuOpen(v => !v)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 12px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4, alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 18, height: 2, background: "rgba(255,255,255,0.6)", borderRadius: 2 }} />
            <div style={{ width: 18, height: 2, background: "rgba(255,255,255,0.6)", borderRadius: 2 }} />
            <div style={{ width: 18, height: 2, background: "rgba(255,255,255,0.6)", borderRadius: 2 }} />
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }}>
              <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 60, right: 20, background: "#1a2530", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "8px 0", minWidth: 200, boxShadow: "0 16px 40px rgba(0,0,0,0.5)", zIndex: 41 }}>
                {/* Navigation tabs */}
                <div style={{ padding: "6px 10px 10px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: 1, textTransform: "uppercase", paddingLeft: 8, marginBottom: 4 }}>Navigation</div>
                  {TABS.map(t => {
                    const active = tab === t.id;
                    return (
                      <div key={t.id} onClick={() => { setTab(t.id); setMenuOpen(false); }} style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "10px 10px", cursor: "pointer", fontSize: 13,
                        fontWeight: active ? 700 : 500,
                        color: active ? "#10B981" : "rgba(255,255,255,0.7)",
                        background: active ? "rgba(16,185,129,0.1)" : "transparent",
                        borderRadius: 10, marginBottom: 2,
                      }}>
                        <span style={{ fontSize: 16 }}>{t.icon}</span>
                        {t.label}
                        {t.comingSoon && (
                          <div style={{ marginLeft: "auto", background: "rgba(168,85,247,0.2)", border: "1px solid rgba(168,85,247,0.4)", borderRadius: 100, padding: "2px 7px", fontSize: 8, fontWeight: 800, color: "#C084FC" }}>BALD</div>
                        )}
                        {active && !t.comingSoon && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />}
                      </div>
                    );
                  })}
                </div>
                {/* Settings items */}
                {[
                  { icon: "👤", label: "Profil" },
                  { icon: "🔔", label: "Benachrichtigungen" },
                  { icon: "⚙️", label: "Einstellungen" },
                  { icon: "🚪", label: "Abmelden" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", cursor: "pointer", fontSize: 13, color: "rgba(255,255,255,0.6)", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 20px 110px", position: "relative", zIndex: 1 }}>
        {tab === "home"      && <HomeTab onTabChange={setTab} appointments={appointments} onBookAppointment={handleBookAppointment} />}
        {tab === "cards"     && <CardsTab appointments={appointments} onBookAppointment={handleBookAppointment} />}
        {tab === "rewards"   && <RewardsTab />}
        {tab === "referral"  && <ReferralTab />}
        {tab === "analytics" && <LockedAnalyticsChart />}
      </div>

      {/* ── Sticky Bottom Bar ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30,
        padding: "12px 20px 28px",
        background: "rgba(13,20,28,0.92)", backdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        display: "flex", justifyContent: "center",
      }}>
        <div style={{ maxWidth: 600, width: "100%" }}>
          <button
            onClick={() => setQrOpen(true)}
            style={{
              width: "100%", padding: "14px 20px",
              background: "linear-gradient(135deg, #10B981, #059669)",
              border: "none", borderRadius: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
              boxShadow: "0 6px 24px rgba(16,185,129,0.35)",
              fontFamily: "inherit",
            }}
          >
            {/* QR icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2"/>
              <rect x="5" y="5" width="3" height="3" fill="white"/>
              <rect x="16" y="5" width="3" height="3" fill="white"/>
              <rect x="5" y="16" width="3" height="3" fill="white"/>
              <path d="M14 14h2v2h-2zM18 14h3v2h-3zM14 18h2v3h-2zM18 18h1v1h-1zM20 20h1v1h-1z" fill="white"/>
            </svg>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Stempel-QR zeigen</span>
          </button>
        </div>
      </div>

      {/* QR Modal */}
      {qrOpen && <QRModal onClose={() => setQrOpen(false)} />}

      {/* Appointment Booking Modal */}
      {bookingCard && (
        <AppointmentModal
          card={{ ...bookingCard, appointment: appointments[bookingCard.id] || bookingCard.appointment }}
          onClose={() => setBookingCard(null)}
          onBook={handleConfirmBooking}
        />
      )}
    </div>
  );
}