export default function EmptyState({ icon = "📭", title, description, actionLabel, onAction }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px dashed rgba(255,255,255,0.1)",
      borderRadius: 20,
      padding: "36px 24px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{title}</div>
      {description && (
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, maxWidth: 260, margin: "0 auto 16px" }}>{description}</div>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} style={{
          background: "#10B981", color: "#fff", border: "none",
          borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit",
        }}>{actionLabel}</button>
      )}
    </div>
  );
}