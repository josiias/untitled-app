import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";

const TYPE_META = {
  appointment_confirmed: { icon: "✅", color: "#10B981" },
  appointment_cancelled:  { icon: "🚫", color: "#EF4444" },
  appointment_rescheduled:{ icon: "📅", color: "#818CF8" },
  appointment_completed:  { icon: "✓", color: "#6366F1" },
  reward_ready:          { icon: "🎁", color: "#F59E0B" },
  stamp_progress:        { icon: "🔥", color: "#10B981" },
  reward_expiry:         { icon: "⏰", color: "#F59E0B" },
  info:                  { icon: "💬", color: "#94A3B8" },
};

export default function NotificationBell({ customerPhone }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!customerPhone) { setLoading(false); return; }
    try {
      const norm = customerPhone.replace(/\s/g, "");
      const notifs = await base44.entities.CustomerNotification.filter(
        { customer_phone: norm },
        "-created_date",
        50
      );
      setNotifications(notifs);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  }, [customerPhone]);

  useEffect(() => {
    loadNotifications();

    // Realtime subscription
    let unsub;
    try {
      unsub = base44.entities.CustomerNotification.subscribe((event) => {
        loadNotifications();
      });
    } catch (e) {}

    return () => { if (unsub) unsub(); };
  }, [loadNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    if (unread.length === 0) return;
    try {
      await base44.entities.CustomerNotification.bulkUpdate(
        unread.map(n => ({ id: n.id, read: true }))
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {}
  };

  const formatTime = (created) => {
    if (!created) return "";
    const d = new Date(created);
    const now = new Date();
    const diffMin = Math.floor((now - d) / 60000);
    if (diffMin < 1) return "gerade eben";
    if (diffMin < 60) return `vor ${diffMin} Min.`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `vor ${diffH} Std.`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `vor ${diffD} Tag${diffD > 1 ? "en" : ""}`;
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
  };

  return (
    <>
      {/* Bell button */}
      <button
        onClick={() => { setOpen(true); if (unreadCount > 0) markAllRead(); }}
        style={{
          position: "relative", width: 40, height: 40, borderRadius: 10,
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, flexShrink: 0,
        }}
        aria-label="Benachrichtigungen"
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            minWidth: 18, height: 18, borderRadius: 100,
            background: "#EF4444", color: "#fff",
            fontSize: 10, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 4px", border: "2px solid #111e28",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification panel */}
      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 100,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            position: "absolute", top: 60, right: 16,
            width: 340, maxWidth: "calc(100vw - 32px)",
            maxHeight: "70vh", overflowY: "auto",
            background: "#1a2530", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16, boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            display: "flex", flexDirection: "column",
          }}>
            {/* Header */}
            <div style={{
              padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              position: "sticky", top: 0, background: "#1a2530", zIndex: 1,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>🔔</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Benachrichtigungen</span>
                {unreadCount > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>{unreadCount} neu</span>
                )}
              </div>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 16, cursor: "pointer" }}>✕</button>
            </div>

            {/* List */}
            {loading ? (
              <div style={{ padding: 32, textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Lädt…</div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: "40px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Keine Benachrichtigungen</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>Sobald es etwas Neues gibt, siehst du es hier.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {notifications.map((n, i) => {
                  const meta = TYPE_META[n.type] || TYPE_META.info;
                  const icon = n.icon || meta.icon;
                  return (
                    <div key={n.id} style={{
                      padding: "14px 16px", borderBottom: i < notifications.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      display: "flex", gap: 12, alignItems: "flex-start",
                      background: n.read ? "transparent" : "rgba(16,185,129,0.04)",
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: `${meta.color}1A`, border: `1px solid ${meta.color}33`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                      }}>{icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{n.title}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2, lineHeight: 1.5 }}>{n.body}</div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>{formatTime(n.created_date)}</div>
                      </div>
                      {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", flexShrink: 0, marginTop: 6 }} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}