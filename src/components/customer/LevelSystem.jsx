import { useState } from "react";

// ── Level & Badge Definitionen ────────────────────────────────────────────────
export const LEVELS = [
  { id: "starter",    label: "Starter",          emoji: "🌱", color: "#6B7280", min: 0   },
  { id: "sammler",    label: "Sammler",           emoji: "⭐", color: "#10B981", min: 10  },
  { id: "stammi",     label: "Stammi",            emoji: "🔥", color: "#F59E0B", min: 25  },
  { id: "profi",      label: "Sensalie Profi",    emoji: "💎", color: "#8B5CF6", min: 50  },
  { id: "koenig",     label: "Sensalie King",     emoji: "👑", color: "#EC4899", min: 100 },
];

export const BADGES = [
  // Stempel-Badges
  { id: "erster_stempel",   label: "Erster Schritt",      emoji: "👣", desc: "Ersten Stempel gesammelt",          type: "stempel",    req: { stamps: 1 } },
  { id: "stempel5",         label: "Fleißiger Sammler",   emoji: "📬", desc: "5 Stempel gesammelt",               type: "stempel",    req: { stamps: 5 } },
  { id: "stempel25",        label: "Stempel-Profi",       emoji: "🏅", desc: "25 Stempel gesammelt",              type: "stempel",    req: { stamps: 25 } },
  { id: "stempel50",        label: "Stempel-König",       emoji: "👑", desc: "50 Stempel gesammelt",              type: "stempel",    req: { stamps: 50 } },
  { id: "stempel100",       label: "Stempel-Legende",     emoji: "🏆", desc: "100 Stempel gesammelt",             type: "stempel",    req: { stamps: 100 } },
  // Empfehlungs-Badges
  { id: "erste_empfehlung", label: "Connector",           emoji: "🤝", desc: "Erste Empfehlung abgegeben",        type: "referral",   req: { referrals: 1 } },
  { id: "empfehlung3",      label: "Netzwerker",          emoji: "🌐", desc: "3 Empfehlungen gemacht",            type: "referral",   req: { referrals: 3 } },
  { id: "empfehlung10",     label: "Empfehlungs-Profi",   emoji: "💸", desc: "10 Empfehlungen gemacht",           type: "referral",   req: { referrals: 10 } },
  // Combo-Badges
  { id: "treuer_kunde",     label: "Treuer Kunde",        emoji: "❤️",  desc: "5 verschiedene Shops besucht",      type: "combo",      req: { stamps: 5, referrals: 1 } },
  { id: "superstar",        label: "Superstar",           emoji: "🌟", desc: "25 Stempel + 3 Empfehlungen",       type: "combo",      req: { stamps: 25, referrals: 3 } },
];

// ── Berechnung des aktuellen Levels & XP ─────────────────────────────────────
export function calcUserStats(totalStamps, totalReferrals) {
  const xp = totalStamps * 1 + totalReferrals * 5;

  let currentLevel = LEVELS[0];
  let nextLevel = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) {
      currentLevel = LEVELS[i];
      nextLevel = LEVELS[i + 1] || null;
      break;
    }
  }

  const xpIntoLevel = nextLevel ? xp - currentLevel.min : 0;
  const xpNeeded    = nextLevel ? nextLevel.min - currentLevel.min : 0;
  const pct         = nextLevel ? Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)) : 100;

  const unlockedBadges = BADGES.filter(b =>
    (b.req.stamps    === undefined || totalStamps    >= b.req.stamps) &&
    (b.req.referrals === undefined || totalReferrals >= b.req.referrals)
  );

  return { xp, currentLevel, nextLevel, pct, xpIntoLevel, xpNeeded, unlockedBadges };
}

// ── Badge Detail Modal ────────────────────────────────────────────────────────
function BadgeModal({ badge, unlocked, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 600, background: "#111e28", borderRadius: "28px 28px 0 0", border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none", padding: "24px 24px 48px" }}>
        <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 100, margin: "0 auto 24px" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 12, filter: unlocked ? "none" : "grayscale(1) opacity(0.3)" }}>{badge.emoji}</div>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 900, color: unlocked ? "#fff" : "rgba(255,255,255,0.3)", marginBottom: 6 }}>{badge.label}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>{badge.desc}</div>
          {unlocked
            ? <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 12, padding: "8px 18px", fontSize: 13, fontWeight: 700, color: "#10B981" }}>✓ Freigeschaltet</div>
            : <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 18px", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                Noch nicht freigeschaltet — sammle weiter!
              </div>
          }
        </div>
      </div>
    </div>
  );
}

// ── Haupt-Komponente ─────────────────────────────────────────────────────────
export default function LevelSystem({ totalStamps, totalReferrals }) {
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const { xp, currentLevel, nextLevel, pct, xpIntoLevel, xpNeeded, unlockedBadges } = calcUserStats(totalStamps, totalReferrals);

  const TYPE_LABELS = { stempel: "Stempel", referral: "Empfehlung", combo: "Kombination" };
  const TYPE_COLORS = { stempel: "#10B981", referral: "#F59E0B", combo: "#8B5CF6" };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Level Card */}
        <div style={{
          borderRadius: 20, overflow: "hidden", position: "relative",
          background: `linear-gradient(135deg, ${currentLevel.color}22, ${currentLevel.color}08)`,
          border: `1.5px solid ${currentLevel.color}44`,
          padding: "18px 18px",
        }}>
          {/* Glow */}
          <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, background: `radial-gradient(circle, ${currentLevel.color}33 0%, transparent 65%)`, pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            {/* Level emoji */}
            <div style={{ width: 52, height: 52, borderRadius: 16, background: `${currentLevel.color}22`, border: `2px solid ${currentLevel.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
              {currentLevel.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 3, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>Dein Level</div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 900, color: "#fff" }}>{currentLevel.label}</div>
              <div style={{ fontSize: 11, color: currentLevel.color, fontWeight: 600, marginTop: 1 }}>{xp} XP gesamt</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>Badges</div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 900, color: currentLevel.color }}>{unlockedBadges.length}<span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>/{BADGES.length}</span></div>
            </div>
          </div>

          {/* XP Progress to next level */}
          {nextLevel ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Nächstes Level: <span style={{ color: nextLevel.color, fontWeight: 700 }}>{nextLevel.emoji} {nextLevel.label}</span></span>
                <span style={{ fontSize: 11, fontWeight: 700, color: currentLevel.color }}>{xpIntoLevel}/{xpNeeded} XP</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 100, height: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${currentLevel.color}88, ${currentLevel.color})`, borderRadius: 100, transition: "width 0.8s ease" }} />
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 5 }}>
                Noch {xpNeeded - xpIntoLevel} XP · 1 XP pro Stempel, 5 XP pro Empfehlung
              </div>
            </div>
          ) : (
            <div style={{ background: `${currentLevel.color}22`, border: `1px solid ${currentLevel.color}44`, borderRadius: 12, padding: "10px 14px", textAlign: "center", fontSize: 13, fontWeight: 700, color: currentLevel.color }}>
              👑 Maximales Level erreicht!
            </div>
          )}
        </div>

        {/* Level Roadmap — kleine Dots */}
        <div style={{ background: "#1a2530", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Level-Roadmap</div>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {LEVELS.map((lvl, i) => {
              const reached = xp >= lvl.min;
              const isCurrent = lvl.id === currentLevel.id;
              return (
                <div key={lvl.id} style={{ display: "flex", alignItems: "center", flex: i < LEVELS.length - 1 ? 1 : 0 }}>
                  {/* Node */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      width: isCurrent ? 36 : 28, height: isCurrent ? 36 : 28,
                      borderRadius: "50%",
                      background: reached ? lvl.color : "rgba(255,255,255,0.07)",
                      border: isCurrent ? `3px solid ${lvl.color}` : "none",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: isCurrent ? 16 : 12,
                      boxShadow: isCurrent ? `0 0 16px ${lvl.color}66` : "none",
                      transition: "all 0.3s", flexShrink: 0,
                    }}>
                      {reached ? lvl.emoji : <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10 }}>●</span>}
                    </div>
                    <span style={{ fontSize: 8, color: reached ? lvl.color : "rgba(255,255,255,0.2)", fontWeight: 700, textAlign: "center", maxWidth: 40 }}>{lvl.label.split(" ")[0]}</span>
                  </div>
                  {/* Connector line */}
                  {i < LEVELS.length - 1 && (
                    <div style={{ flex: 1, height: 3, background: xp >= LEVELS[i + 1].min ? `linear-gradient(90deg, ${lvl.color}, ${LEVELS[i+1].color})` : "rgba(255,255,255,0.07)", borderRadius: 100, margin: "0 2px", marginBottom: 20 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1 }}>Badges · {unlockedBadges.length}/{BADGES.length}</div>
            <button onClick={() => setShowAllBadges(v => !v)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              {showAllBadges ? "Weniger ▲" : "Alle zeigen ▼"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {(showAllBadges ? BADGES : BADGES).map(badge => {
              const unlocked = unlockedBadges.some(b => b.id === badge.id);
              const typeColor = TYPE_COLORS[badge.type] || "#10B981";
              return (
                <div key={badge.id} onClick={() => setSelectedBadge({ badge, unlocked })}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                    background: unlocked ? `${typeColor}15` : "rgba(255,255,255,0.04)",
                    border: unlocked ? `1.5px solid ${typeColor}40` : "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 14, padding: "12px 6px", cursor: "pointer", transition: "all 0.2s",
                    boxShadow: unlocked ? `0 4px 14px ${typeColor}22` : "none",
                  }}>
                  <span style={{ fontSize: 24, filter: unlocked ? "none" : "grayscale(1) opacity(0.25)" }}>{badge.emoji}</span>
                  <span style={{ fontSize: 8, fontWeight: 700, color: unlocked ? typeColor : "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.3 }}>{badge.label}</span>
                  {unlocked && <div style={{ width: 5, height: 5, borderRadius: "50%", background: typeColor }} />}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            {Object.entries(TYPE_LABELS).map(([type, label]) => (
              <div key={type} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: TYPE_COLORS[type] }} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <BadgeModal badge={selectedBadge.badge} unlocked={selectedBadge.unlocked} onClose={() => setSelectedBadge(null)} />
      )}
    </>
  );
}