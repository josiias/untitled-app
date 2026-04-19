import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { sensalieBot } from "@/functions/sensalieBot";

const USER_PHONE = "0151 234 567 89";
const USER_NAME = "Max Mustermann";

const QUICK_QUESTIONS = [
  "Wie funktioniert das Stempeln?",
  "Wann bekomme ich meine Provision?",
  "Wie viele Stempel brauche ich?",
  "Was ist Sensalie Plus?",
  "Wie empfehle ich einen Freund?",
];

const TICKET_CATEGORIES = [
  { value: "stempel", label: "Stempel / QR-Code", emoji: "⬛" },
  { value: "provision", label: "Provision / Empfehlung", emoji: "💸" },
  { value: "partner", label: "Partnerbetrieb", emoji: "🏪" },
  { value: "app", label: "App-Problem", emoji: "📱" },
  { value: "sonstiges", label: "Sonstiges", emoji: "💬" },
];

function TicketForm({ onClose, onSubmitted }) {
  const [form, setForm] = useState({ subject: "", message: "", category: "sonstiges", priority: "mittel" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await base44.entities.SupportTicket.create({
        ...form,
        user_name: USER_NAME,
        user_phone: USER_PHONE,
        status: "offen",
      });
      onSubmitted();
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "20px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🎫</span>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Support-Ticket erstellen</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 18, cursor: "pointer" }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Category */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 8 }}>Kategorie</label>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TICKET_CATEGORIES.map(cat => (
              <button key={cat.value} type="button" onClick={() => setForm(f => ({ ...f, category: cat.value }))}
                style={{ padding: "6px 12px", borderRadius: 10, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit",
                  background: form.category === cat.value ? "#10B981" : "rgba(255,255,255,0.06)",
                  color: form.category === cat.value ? "#fff" : "rgba(255,255,255,0.5)" }}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Betreff *</label>
          <input required type="text" placeholder="Kurze Beschreibung..."
            value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
            style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 13, color: "#fff", fontFamily: "inherit", outline: "none" }} />
        </div>

        {/* Message */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Nachricht *</label>
          <textarea required rows={4} placeholder="Beschreibe dein Problem ausführlich..."
            value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 13, color: "#fff", fontFamily: "inherit", outline: "none", resize: "vertical" }} />
        </div>

        {/* Priority */}
        <div style={{ display: "flex", gap: 8 }}>
          {[{ v: "niedrig", l: "Niedrig", c: "#10B981" }, { v: "mittel", l: "Mittel", c: "#F59E0B" }, { v: "hoch", l: "Hoch 🔥", c: "#EF4444" }].map(p => (
            <button key={p.v} type="button" onClick={() => setForm(f => ({ ...f, priority: p.v }))}
              style={{ flex: 1, padding: "8px", borderRadius: 10, border: form.priority === p.v ? "none" : "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 700,
                background: form.priority === p.v ? p.c + "33" : "rgba(255,255,255,0.04)",
                color: form.priority === p.v ? p.c : "rgba(255,255,255,0.4)" }}>
              {p.l}
            </button>
          ))}
        </div>

        <button type="submit" disabled={submitting || !form.subject || !form.message}
          style={{ padding: "13px", background: submitting ? "rgba(16,185,129,0.5)" : "#10B981", color: "#fff", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
          {submitting ? "Wird gesendet…" : "Ticket absenden →"}
        </button>
      </form>
    </div>
  );
}

export default function SupportChatTab() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hallo! 👋 Ich bin **Julia** von Sensalie 💚 Ich helfe dir gerne bei allen Fragen rund um deine Stempelkarte, Prämien und Empfehlungen — oder ich leite dich an unser Team weiter. Wie kann ich dir helfen?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTicketForm]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");

    const newMessages = [...messages, { from: "user", text: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await sensalieBot({ message: userText, history: messages });
      const { reply, action } = res.data;

      setMessages(prev => [...prev, { from: "bot", text: reply }]);

      if (action === "open_ticket_form") {
        setShowTicketForm(true);
      }
    } catch (err) {
      setMessages(prev => [...prev, { from: "bot", text: "Entschuldigung, da ist leider etwas schiefgelaufen 😕 Bitte versuche es nochmal — oder erstelle direkt ein Ticket, dann schaut unser Team persönlich drauf!" }]);
    }
    setLoading(false);
  };

  const handleTicketSubmitted = () => {
    setShowTicketForm(false);
    setTicketSuccess(true);
    setMessages(prev => [...prev, { from: "bot", text: "✅ Perfekt, dein Ticket ist bei uns angekommen! Wir melden uns innerhalb von 24 Stunden — versprochen 💚 Kann ich dir noch bei etwas helfen?" }]);
    setTimeout(() => setTicketSuccess(false), 4000);
  };

  const renderText = (text) => {
    // Simple bold markdown
    return text.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "calc(100vh - 220px)", minHeight: 500 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 0 16px" }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👩</div>
          <div style={{ position: "absolute", bottom: 2, right: 2, width: 10, height: 10, borderRadius: "50%", background: "#10B981", border: "2px solid #111e28" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>Julia · Sensalie Support</div>
          <div style={{ fontSize: 11, color: "#10B981", fontWeight: 600 }}>● Online · Antwortet sofort</div>
        </div>
        <button onClick={() => setShowTicketForm(v => !v)}
          style={{ background: showTicketForm ? "rgba(255,255,255,0.1)" : "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "7px 12px", fontSize: 11, fontWeight: 700, color: "#10B981", cursor: "pointer", fontFamily: "inherit" }}>
          🎫 Ticket
        </button>
      </div>

      {/* Ticket form */}
      {showTicketForm && (
        <div style={{ marginBottom: 12 }}>
          <TicketForm onClose={() => setShowTicketForm(false)} onSubmitted={handleTicketSubmitted} />
        </div>
      )}

      {/* Ticket success */}
      {ticketSuccess && (
        <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 14, padding: "10px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#10B981", fontWeight: 600 }}>
          ✅ Ticket wurde erstellt — wir melden uns bald!
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingRight: 2 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: 8, flexDirection: msg.from === "user" ? "row-reverse" : "row" }}>
            {/* Avatar */}
            {msg.from === "bot" && (
              <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>👩</div>
            )}
            {msg.from === "user" && (
              <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #3B82F6, #1D4ED8)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>MM</div>
            )}
            {/* Bubble */}
            <div style={{
              maxWidth: "78%",
              padding: "10px 14px",
              borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.from === "user" ? "linear-gradient(135deg, #10B981, #059669)" : "#1a2530",
              border: msg.from === "bot" ? "1px solid rgba(255,255,255,0.08)" : "none",
              fontSize: 13,
              color: "#fff",
              lineHeight: 1.5,
            }}>
              <span dangerouslySetInnerHTML={{ __html: renderText(msg.text) }} />
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>👩</div>
            <div style={{ padding: "10px 16px", borderRadius: "18px 18px 18px 4px", background: "#1a2530", border: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick questions (only at start) */}
      {messages.length <= 1 && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2, paddingTop: 10, flexShrink: 0 }}>
          {QUICK_QUESTIONS.map((q, i) => (
            <button key={i} onClick={() => sendMessage(q)}
              style={{ whiteSpace: "nowrap", padding: "8px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, border: "1px solid rgba(16,185,129,0.3)", cursor: "pointer", fontFamily: "inherit", background: "rgba(16,185,129,0.08)", color: "#10B981", flexShrink: 0 }}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 8, paddingTop: 12, flexShrink: 0 }}>
        <input
          type="text"
          placeholder="Frage stellen…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          style={{ flex: 1, padding: "12px 16px", background: "#1a2530", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 14, fontSize: 13, color: "#fff", fontFamily: "inherit", outline: "none" }}
        />
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
          style={{ width: 48, height: 48, background: input.trim() && !loading ? "#10B981" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 14, cursor: input.trim() && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
          ➤
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}