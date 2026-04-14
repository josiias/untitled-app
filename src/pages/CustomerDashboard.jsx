import { useState, useEffect, useRef } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────────────
const USER = { name: "Max Mustermann", phone: "0151 234 567 89", avatar: "MM", since: "März 2026" };

const STAMP_CARDS = [
  {
    id: 1, name: "Kings Barbershop", emoji: "✂️", category: "Barbershop",
    stamps: 5, required: 8, reward: "10€ Gutschein",
    img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    color: "#10B981",
    nextVisit: "Nächster Besuch: Morgen",
  },
  {
    id: 2, name: "Café Milano", emoji: "☕", category: "Café",
    stamps: 3, required: 6, reward: "1 Kaffee gratis",
    img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
    color: "#F59E0B",
    nextVisit: "Offen heute bis 20 Uhr",
  },
  {
    id: 3, name: "Bella Nails", emoji: "💅", category: "Beauty",
    stamps: 7, required: 8, reward: "Maniküre gratis",
    img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
    color: "#EC4899",
    nextVisit: "Fast geschafft! 🎉",
  },
  {
    id: 4, name: "Massage Studio", emoji: "💆", category: "Wellness",
    stamps: 1, required: 10, reward: "1 Massage gratis",
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    color: "#8B5CF6",
    nextVisit: "Termin buchen",
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
    id: 3, name: "Bella Nails", emoji: "💅", category: "Beauty",
    img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
    reward: "Maniküre gratis", provision: "12€ pro Empfehlung", color: "#EC4899", type: "both",
  },
  {
    id: 4, name: "Massage Studio", emoji: "💆", category: "Wellness",
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    reward: "1 Massage gratis", provision: null, color: "#8B5CF6", type: "stamps",
  },
  {
    id: 5, name: "Flower Garden", emoji: "🌸", category: "Floristik",
    img: "https://images.unsplash.com/photo-1487530811015-780b4baa2c76?w=800&q=80",
    reward: null, provision: "20€ pro Empfehlung", color: "#F472B6", type: "referral",
  },
  {
    id: 6, name: "Sushi Lounge", emoji: "🍱", category: "Restaurant",
    img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
    reward: "1 Rolle gratis", provision: "10€ pro Empfehlung", color: "#06B6D4", type: "both",
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
  { id: "home",     icon: "▦",  label: "Übersicht" },
  { id: "cards",    icon: "◈",  label: "Karten" },
  { id: "rewards",  icon: "⬡",  label: "Prämien" },
  { id: "referral", icon: "◎",  label: "Empfehlen" },
];

// ── StampDots ─────────────────────────────────────────────────────────────────
function StampDots({ stamps, required, color }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
      {Array.from({ length: required }).map((_, i) => (
        <div key={i} style={{
          width: 22, height: 22, borderRadius: 6,
          background: i < stamps ? color : "rgba(255,255,255,0.07)",
          border: i < stamps ? "none" : "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, color: "#fff", fontWeight: 700,
          boxShadow: i === stamps - 1 ? `0 0 10px ${color}88` : "none",
          transition: "all 0.3s",
        }}>
          {i < stamps ? "✓" : ""}
        </div>
      ))}
    </div>
  );
}

// ── StampCard ─────────────────────────────────────────────────────────────────
function StampCard({ card, compact = false }) {
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

        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 11, color: card.color, fontWeight: 600 }}>🎁 {card.reward}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{card.nextVisit}</div>
        </div>
      </div>
    </div>
  );
}

// ── Partner Auto-Ticker (slower + touch-scrollable) ───────────────────────────
function PartnerCarousel() {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const CARD_W = 105 + 8; // minWidth + gap
  const totalW = PARTNER_BUSINESSES.length * CARD_W;
  const items = [...PARTNER_BUSINESSES, ...PARTNER_BUSINESSES, ...PARTNER_BUSINESSES];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf;
    const tick = () => {
      if (!pausedRef.current) {
        posRef.current += 0.28; // slower
        if (posRef.current >= totalW) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Allow touch/mouse drag to scroll — pause auto-scroll while dragging
  const dragStart = useRef(null);
  const onPointerDown = (e) => { pausedRef.current = true; dragStart.current = e.clientX; };
  const onPointerMove = (e) => {
    if (dragStart.current === null) return;
    const dx = dragStart.current - e.clientX;
    posRef.current = Math.max(0, Math.min(posRef.current + dx, totalW - 1));
    trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    dragStart.current = e.clientX;
  };
  const onPointerUp = () => { dragStart.current = null; setTimeout(() => { pausedRef.current = false; }, 1200); };

  return (
    <div style={{ margin: "0 -20px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, padding: "0 20px" }}>Partnerbetriebe</div>
      <div ref={containerRef} style={{ overflow: "hidden", position: "relative", cursor: "grab", userSelect: "none" }}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
        {/* Fade edges */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 20, background: "linear-gradient(to right, #111e28, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 20, background: "linear-gradient(to left, #111e28, transparent)", zIndex: 2, pointerEvents: "none" }} />
        <div ref={trackRef} style={{ display: "flex", gap: 8, willChange: "transform" }}>
          {items.map((biz, idx) => (
            <div key={idx} style={{
              minWidth: 105, borderRadius: 14, overflow: "hidden", position: "relative",
              height: 140, flexShrink: 0,
              border: `1px solid ${biz.color}33`,
            }}>
              <img src={biz.img} alt={biz.name} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 20%, rgba(13,20,28,0.97) 100%)" }} />
              <div style={{ position: "absolute", top: 6, left: 6, background: `${biz.color}CC`, borderRadius: 100, padding: "1px 6px", fontSize: 7, fontWeight: 800, color: "#fff" }}>
                {biz.type === "referral" ? "💸" : biz.type === "stamps" ? "🎁" : "💸🎁"}
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 8px" }}>
                <div style={{ fontSize: 11, marginBottom: 1 }}>{biz.emoji}</div>
                <div style={{ fontSize: 10, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 2 }}>{biz.name}</div>
                {biz.provision && <div style={{ fontSize: 8, color: "#63FFB4", fontWeight: 700 }}>💸 {biz.provision}</div>}
                {biz.reward && <div style={{ fontSize: 8, color: biz.color, fontWeight: 600 }}>🎁 {biz.reward}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Provision Widget ──────────────────────────────────────────────────────────
function ProvisionWidget() {
  return (
    <div style={{
      borderRadius: 20, overflow: "hidden", position: "relative",
      background: "linear-gradient(135deg, #0d1f14, #0f2d1f)",
      border: "1.5px solid rgba(16,185,129,0.25)",
      padding: "18px 18px",
    }}>
      <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 160, height: 160, background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 65%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Deine Provision</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "12px 14px" }}>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 900, color: "#10B981" }}>{REFERRAL_STATS.earned.toFixed(2)}€</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Gesamt verdient</div>
        </div>
        <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "12px 14px" }}>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 900, color: "#F59E0B" }}>{REFERRAL_STATS.pending.toFixed(2)}€</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Ausstehend</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: "10px 14px" }}>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>Dein Empfehlungscode</div>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 900, color: "#63FFB4", letterSpacing: 2 }}>{REFERRAL_STATS.code}</div>
        </div>
        <div style={{ fontSize: 10, color: "#10B981", fontWeight: 700 }}>{REFERRAL_STATS.count} Empfehlungen →</div>
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
function HomeTab({ onTabChange }) {
  const [activityExpanded, setActivityExpanded] = useState(false);
  const visibleActivity = activityExpanded ? ACTIVITY : ACTIVITY.slice(0, 2);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Hero greeting */}
      <div style={{
        borderRadius: 24, overflow: "hidden", position: "relative", height: 160,
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      }}>
        <div style={{ position: "absolute", top: "-30%", right: "-10%", width: 220, height: 220, background: "radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 65%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: 0, padding: "22px 22px" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Willkommen zurück 👋</div>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 10 }}>{USER.name.split(" ")[0]}</div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "8px 14px" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#10B981" }}>{STAMP_CARDS.reduce((a, c) => a + c.stamps, 0)}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>Stempel gesamt</div>
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
      </div>

      {/* Partner Businesses Carousel */}
      <PartnerCarousel />

      {/* Provision Widget */}
      <ProvisionWidget />

      {/* Almost done card */}
      {STAMP_CARDS.filter(c => c.stamps >= c.required - 1).length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Fast geschafft 🔥</div>
          {STAMP_CARDS.filter(c => c.stamps >= c.required - 1).map(card => (
            <StampCard key={card.id} card={card} compact />
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

      {/* Rangliste — LAST */}
      <RankingComingSoon />
    </div>
  );
}

// ── Cards Tab ──────────────────────────────────────────────────────────────────
function CardsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Deine {STAMP_CARDS.length} Stempelkarten</div>
      {STAMP_CARDS.map(card => <StampCard key={card.id} card={card} />)}
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

  const copy = () => {
    navigator.clipboard.writeText(`Schau dir Sensalie an: sensalie.app?ref=${REFERRAL_STATS.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referrablePartners = PARTNER_BUSINESSES.filter(b => b.provision);
  const filtered = search.trim()
    ? referrablePartners.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase()))
    : referrablePartners;

  const handleShare = (biz) => {
    const msg = `Hey! Ich empfehle dir ${biz.name} auf Sensalie – registriere dich mit meinem Code ${REFERRAL_STATS.code} und wir beide profitieren! 💸`;
    if (navigator.share) {
      navigator.share({ title: `${biz.name} empfehlen`, text: msg });
    } else {
      navigator.clipboard.writeText(msg);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Earnings overview */}
      <div style={{ borderRadius: 24, background: "linear-gradient(135deg, #0d2137, #1a3a4a)", border: "1px solid rgba(99,255,180,0.15)", padding: "22px 22px" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 14 }}>Deine Einnahmen</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 900, color: "#10B981" }}>{REFERRAL_STATS.earned.toFixed(2)}€</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>Gesamt verdient</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 900, color: "#F59E0B" }}>{REFERRAL_STATS.pending.toFixed(2)}€</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>Ausstehend</div>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 900, color: "#EC4899" }}>{REFERRAL_STATS.count}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>Empfehlungen</div>
          </div>
        </div>

        {/* Referral code */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Dein persönlicher Code</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 900, color: "#63FFB4", letterSpacing: 3 }}>{REFERRAL_STATS.code}</div>
            <button onClick={copy} style={{ background: copied ? "#10B981" : "rgba(16,185,129,0.15)", color: copied ? "#fff" : "#10B981", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.3s" }}>
              {copied ? "✓ Kopiert!" : "Kopieren"}
            </button>
          </div>
        </div>
      </div>

      {/* Share CTA */}
      <button style={{ width: "100%", padding: "15px", background: "linear-gradient(135deg, #10B981, #059669)", color: "#fff", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 20px rgba(16,185,129,0.3)" }}>
        💬 Via WhatsApp teilen
      </button>

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
          {filtered.map(biz => (
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
              <button onClick={() => handleShare(biz)} style={{ marginRight: 12, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", borderRadius: 10, padding: "7px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                Teilen →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: "#1a2530", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "18px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 14 }}>So verdienst du Geld</div>
        {[
          { icon: "1️⃣", text: "Teile deinen Code mit Freunden" },
          { icon: "2️⃣", text: "Dein Freund registriert sich & besucht ein Geschäft" },
          { icon: "3️⃣", text: "Du erhältst automatisch deine Provision" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < 2 ? 12 : 0 }}>
            <span style={{ fontSize: 18 }}>{s.icon}</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{s.text}</span>
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

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function CustomerDashboard() {
  const [tab, setTab] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

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
                        {active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />}
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
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px 20px 40px", position: "relative", zIndex: 1 }}>
        {tab === "home"     && <HomeTab onTabChange={setTab} />}
        {tab === "cards"    && <CardsTab />}
        {tab === "rewards"  && <RewardsTab />}
        {tab === "referral" && <ReferralTab />}
      </div>

      {/* No bottom nav — navigation is in hamburger menu */}
    </div>
  );
}