import { useState, useEffect } from "react";

const STORAGE_KEY = "sensalie_onboarding_v2";

const TAB_HINTS = {
  home: {
    emoji: "👋",
    title: "Dein Überblick",
    text: "Hier siehst du alle Highlights auf einen Blick — Ersparnisse, Termine und aktuelle Aktionen.",
  },
  cards: {
    emoji: "◈",
    title: "Deine Stempelkarten",
    text: "Jeder Besuch bringt dich näher zur Prämie. Zeig den QR-Code unten an der Kasse.",
  },
  rewards: {
    emoji: "🎁",
    title: "Einlösbare Prämien",
    text: "Sobald du genug Stempel hast, erscheint deine Prämie hier — einfach an der Kasse vorzeigen.",
  },
  referral: {
    emoji: "💸",
    title: "Geld verdienen",
    text: "Teile deinen Link und verdiene automatisch Provision für jeden Freund, den du bringst.",
  },
  suggest: {
    emoji: "💡",
    title: "Wünsche einreichen",
    text: "Dein Lieblingsladen noch nicht dabei? Schlage ihn vor — wir kontaktieren ihn für dich.",
  },
  support: {
    emoji: "💬",
    title: "Julia hilft dir",
    text: "Hast du Fragen? Julia antwortet sofort — oder erstelle ein Ticket für unser Team.",
  },
};

function getSeenTabs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function markTabSeen(tabId) {
  const seen = getSeenTabs();
  if (!seen.includes(tabId)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen, tabId]));
  }
}

// ── Welcome Banner (Home Tab only, once) ─────────────────────────────────────
export function WelcomeBanner({ userName }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = getSeenTabs();
    if (!seen.includes("welcome")) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    markTabSeen("welcome");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))",
      border: "1px solid rgba(16,185,129,0.25)",
      borderRadius: 16,
      padding: "14px 16px",
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      animation: "fadeSlideIn 0.4s ease",
    }}>
      <div style={{ fontSize: 28, flexShrink: 0 }}>👋</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
          Willkommen bei Sensalie{userName ? `, ${userName.split(" ")[0]}` : ""}!
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
          Entdecke die Tabs unten — sammel Stempel, löse Prämien ein und verdiene mit Empfehlungen.
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {["◈ Karten", "🎁 Prämien", "💸 Empfehlen"].map((label, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 100, padding: "4px 10px", fontSize: 11, fontWeight: 600,
              color: "rgba(255,255,255,0.55)",
            }}>{label}</div>
          ))}
        </div>
      </div>
      <button onClick={dismiss} style={{
        background: "none", border: "none", color: "rgba(255,255,255,0.25)",
        fontSize: 16, cursor: "pointer", padding: 0, flexShrink: 0, marginTop: 2,
      }}>✕</button>
    </div>
  );
}

// ── Tab Hint Tooltip (shows once per tab) ─────────────────────────────────────
export function TabHint({ tabId }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so it doesn't flash instantly on tab switch
    const t = setTimeout(() => {
      const seen = getSeenTabs();
      if (!seen.includes(tabId) && tabId !== "home") {
        setVisible(true);
        markTabSeen(tabId);
      }
    }, 600);
    return () => clearTimeout(t);
  }, [tabId]);

  const dismiss = () => setVisible(false);

  if (!visible || !TAB_HINTS[tabId]) return null;

  const hint = TAB_HINTS[tabId];

  return (
    <div style={{
      background: "#1a2530",
      border: "1px solid rgba(16,185,129,0.3)",
      borderRadius: 14,
      padding: "12px 14px",
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      animation: "fadeSlideIn 0.35s ease",
      position: "relative",
    }}>
      {/* Accent line */}
      <div style={{ position: "absolute", left: 0, top: 14, bottom: 14, width: 3, background: "#10B981", borderRadius: "0 3px 3px 0" }} />
      <div style={{ fontSize: 20, flexShrink: 0, marginLeft: 4 }}>{hint.emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{hint.title}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{hint.text}</div>
      </div>
      <button onClick={dismiss} style={{
        background: "none", border: "none", color: "rgba(255,255,255,0.2)",
        fontSize: 14, cursor: "pointer", padding: 0, flexShrink: 0,
      }}>✕</button>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}