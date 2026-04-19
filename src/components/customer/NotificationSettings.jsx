import { useState, useEffect } from "react";

const STORAGE_KEY = "sensalie_notification_prefs";

const DEFAULT_PREFS = {
  enabled: false,
  stampProgress: true,   // bei 80% Stempel
  rewardExpiry: true,    // Gutschein läuft ab
};

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 100,
        background: checked ? "#10B981" : "rgba(255,255,255,0.12)",
        position: "relative", cursor: "pointer", transition: "background 0.25s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }} />
    </div>
  );
}

export default function NotificationSettings({ onClose }) {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [permission, setPermission] = useState("default");
  const [requesting, setRequesting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved prefs
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPrefs(JSON.parse(stored));
    } catch (e) {}
    // Check current permission
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;
    setRequesting(true);
    const result = await Notification.requestPermission();
    setPermission(result);
    setRequesting(false);
    if (result === "granted") {
      updatePref("enabled", true);
      // Demo notification
      new Notification("Sensalie 💚", {
        body: "Benachrichtigungen sind jetzt aktiv! Du wirst informiert, wenn du fast fertig bist.",
        icon: "/favicon.ico",
      });
    }
  };

  const updatePref = (key, value) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose && onClose(); }, 1200);
  };

  const notSupported = !("Notification" in window);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>🔔 Benachrichtigungen</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>Bleib immer auf dem Laufenden</div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 20, cursor: "pointer" }}>✕</button>
        )}
      </div>

      {/* Permission banner */}
      {notSupported ? (
        <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 14, padding: "14px 16px", fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
          ⚠️ Dein Browser unterstützt keine Push-Benachrichtigungen. Bitte nutze Chrome oder Safari auf dem Handy.
        </div>
      ) : permission === "denied" ? (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 14, padding: "14px 16px", fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
          🚫 Du hast Benachrichtigungen blockiert. Bitte erlaube sie in deinen Browser-Einstellungen und lade die Seite neu.
        </div>
      ) : permission !== "granted" ? (
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 16, padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Benachrichtigungen erlauben</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 14, lineHeight: 1.5 }}>
            Tippe auf „Erlauben", damit Sensalie dich benachrichtigen kann — z.B. wenn deine Stempelkarte fast voll ist.
          </div>
          <button onClick={requestPermission} disabled={requesting} style={{
            width: "100%", padding: "12px", background: requesting ? "rgba(16,185,129,0.4)" : "#10B981",
            color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800,
            cursor: requesting ? "not-allowed" : "pointer", fontFamily: "inherit",
          }}>
            {requesting ? "Warte auf Erlaubnis…" : "🔔 Benachrichtigungen erlauben"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, padding: "10px 14px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#10B981" }}>Benachrichtigungen sind erlaubt ✓</span>
        </div>
      )}

      {/* Master toggle */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Alle Benachrichtigungen</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>Master-Schalter für alle Erinnerungen</div>
          </div>
          <Toggle
            checked={prefs.enabled && permission === "granted"}
            onChange={(v) => {
              if (v && permission !== "granted") {
                requestPermission();
              } else {
                updatePref("enabled", v);
              }
            }}
          />
        </div>
      </div>

      {/* Individual settings */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden", opacity: prefs.enabled && permission === "granted" ? 1 : 0.4, transition: "opacity 0.2s" }}>

        {/* Stamp progress */}
        <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>⬛</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Stempelkarte fast voll</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                Benachrichtigung wenn du 80% der Stempel erreicht hast — z.B. bei 6 von 8 Stempeln.
              </div>
            </div>
            <Toggle
              checked={prefs.stampProgress}
              onChange={(v) => updatePref("stampProgress", v)}
            />
          </div>
          {/* Preview */}
          <div style={{ marginTop: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, background: "rgba(16,185,129,0.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>⬛</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>Sensalie</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>
                🔥 Noch 1 Stempel bei Kings Barbershop — dann gibt's deinen 10€ Gutschein!
              </div>
            </div>
          </div>
        </div>

        {/* Reward expiry */}
        <div style={{ padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>🎁</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Gutschein läuft bald ab</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                Erinnerung 7 Tage vor Ablauf deines Gutscheins, damit du ihn nicht vergisst.
              </div>
            </div>
            <Toggle
              checked={prefs.rewardExpiry}
              onChange={(v) => updatePref("rewardExpiry", v)}
            />
          </div>
          {/* Preview */}
          <div style={{ marginTop: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 12px", display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, background: "rgba(245,158,11,0.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🎁</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>Sensalie</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>
                ⏰ Dein Gutschein „Kaffee gratis" läuft in 7 Tagen ab — jetzt einlösen!
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <button onClick={handleSave} style={{
        padding: "13px", background: saved ? "#059669" : "#10B981",
        color: "#fff", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 800,
        cursor: "pointer", fontFamily: "inherit", transition: "background 0.3s",
      }}>
        {saved ? "✓ Gespeichert!" : "Einstellungen speichern"}
      </button>
    </div>
  );
}

// Hook to check notification prefs and fire notifications
export function useNotificationChecker(stampCards, rewards) {
  useEffect(() => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const prefs = stored ? JSON.parse(stored) : DEFAULT_PREFS;
      if (!prefs.enabled) return;

      // Check stamp cards at 80%+
      if (prefs.stampProgress) {
        stampCards.forEach(card => {
          const pct = card.stamps / card.required;
          if (pct >= 0.8 && pct < 1) {
            const remaining = card.required - card.stamps;
            const notifKey = `notif_stamp_${card.id}_${card.stamps}`;
            if (!sessionStorage.getItem(notifKey)) {
              sessionStorage.setItem(notifKey, "1");
              setTimeout(() => {
                new Notification("Sensalie 🔥", {
                  body: `Noch ${remaining} Stempel bei ${card.name} — dann gibt's: ${card.reward}!`,
                  icon: "/favicon.ico",
                });
              }, 2000);
            }
          }
        });
      }

      // Check reward expiry (within 14 days)
      if (prefs.rewardExpiry) {
        const today = new Date();
        rewards.forEach(r => {
          if (!r.expires) return;
          const [d, m, y] = r.expires.split(".");
          const expDate = new Date(`${y}-${m}-${d}`);
          const daysLeft = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
          if (daysLeft <= 14 && daysLeft > 0) {
            const notifKey = `notif_reward_${r.id}`;
            if (!sessionStorage.getItem(notifKey)) {
              sessionStorage.setItem(notifKey, "1");
              setTimeout(() => {
                new Notification("Sensalie 🎁", {
                  body: `„${r.title}" läuft in ${daysLeft} Tagen ab — jetzt einlösen!`,
                  icon: "/favicon.ico",
                });
              }, 3500);
            }
          }
        });
      }
    } catch (e) {}
  }, []);
}