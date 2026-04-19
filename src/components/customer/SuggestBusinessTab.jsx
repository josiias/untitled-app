import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const CATEGORIES = [
  "Barbershop", "Café", "Restaurant", "Beauty", "Nagelstudio",
  "Friseur", "Massage", "Wellness", "Fitness", "Bäckerei",
  "Apotheke", "Supermarkt", "Andere"
];

const FREQUENCY_OPTIONS = [
  { value: "täglich", label: "Täglich", emoji: "🔥" },
  { value: "wöchentlich", label: "Wöchentlich", emoji: "📅" },
  { value: "monatlich", label: "Monatlich", emoji: "🗓️" },
  { value: "selten", label: "Selten", emoji: "💭" },
];

const STATUS_CONFIG = {
  offen: { label: "Vorgeschlagen", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  in_bearbeitung: { label: "Wird kontaktiert ⚡", color: "#10B981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" },
  gewonnen: { label: "Jetzt dabei! 🎉", color: "#63FFB4", bg: "rgba(99,255,180,0.12)", border: "rgba(99,255,180,0.3)" },
};

const USER_PHONE = "0151 234 567 89"; // In real app: from auth

export default function SuggestBusinessTab({ categoryFilter, onCategoryChange, allCategories }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ business_name: "", category: "", city: "", visit_frequency: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [votedIds, setVotedIds] = useState(new Set());

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.BusinessSuggestion.list("-votes", 50);
      setSuggestions(data);
      // Track which ones user already voted
      const alreadyVoted = new Set(
        data.filter(s => (s.voted_by || []).includes(USER_PHONE)).map(s => s.id)
      );
      setVotedIds(alreadyVoted);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Check if already exists
      const existing = await base44.entities.BusinessSuggestion.filter({
        business_name: form.business_name,
        city: form.city
      }, "-votes", 1);

      if (existing.length > 0) {
        // Just upvote existing
        const s = existing[0];
        if (!(s.voted_by || []).includes(USER_PHONE)) {
          await base44.entities.BusinessSuggestion.update(s.id, {
            votes: (s.votes || 1) + 1,
            voted_by: [...(s.voted_by || []), USER_PHONE]
          });
        }
      } else {
        await base44.entities.BusinessSuggestion.create({
          ...form,
          votes: 1,
          voted_by: [USER_PHONE],
          status: "offen",
          suggested_by_phone: USER_PHONE,
        });
      }
      setSubmitted(true);
      setShowForm(false);
      setForm({ business_name: "", category: "", city: "", visit_frequency: "" });
      await loadSuggestions();
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const handleVote = async (suggestion) => {
    if (votedIds.has(suggestion.id)) return;
    try {
      await base44.entities.BusinessSuggestion.update(suggestion.id, {
        votes: (suggestion.votes || 1) + 1,
        voted_by: [...(suggestion.voted_by || []), USER_PHONE]
      });
      setVotedIds(prev => new Set([...prev, suggestion.id]));
      setSuggestions(prev =>
        prev.map(s => s.id === suggestion.id
          ? { ...s, votes: (s.votes || 1) + 1, voted_by: [...(s.voted_by || []), USER_PHONE] }
          : s
        ).sort((a, b) => (b.votes || 1) - (a.votes || 1))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = categoryFilter && categoryFilter !== "Alle"
    ? suggestions.filter(s => s.category === categoryFilter)
    : suggestions;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header + CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 900, color: "#fff" }}>Wunsch-Unternehmen</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>Stimme ab oder schlage ein neues vor</div>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); setSubmitted(false); }}
          style={{
            background: showForm ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg, #10B981, #059669)",
            color: "#fff", border: "none", borderRadius: 12, padding: "10px 16px",
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {showForm ? "✕ Abbrechen" : "+ Vorschlagen"}
        </button>
      </div>

      {/* Success toast */}
      {submitted && (
        <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981" }}>Danke für deinen Vorschlag!</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Wir kontaktieren das Unternehmen so schnell wie möglich.</div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "20px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Unternehmen vorschlagen</div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Name des Unternehmens *</label>
            <input
              required
              type="text"
              placeholder="z.B. Barber Palace"
              value={form.business_name}
              onChange={e => setForm({ ...form, business_name: e.target.value })}
              style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, color: "#fff", fontFamily: "inherit", outline: "none" }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Kategorie *</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  style={{
                    padding: "7px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", border: "none",
                    background: form.category === cat ? "#10B981" : "rgba(255,255,255,0.06)",
                    color: form.category === cat ? "#fff" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Stadt *</label>
            <input
              required
              type="text"
              placeholder="z.B. Berlin"
              value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
              style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, color: "#fff", fontFamily: "inherit", outline: "none" }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Wie oft gehst du dort hin? *</label>
            <div style={{ display: "flex", gap: 8 }}>
              {FREQUENCY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, visit_frequency: opt.value })}
                  style={{
                    flex: 1, padding: "10px 6px", borderRadius: 12, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", border: "none", textAlign: "center",
                    background: form.visit_frequency === opt.value ? "#10B981" : "rgba(255,255,255,0.06)",
                    color: form.visit_frequency === opt.value ? "#fff" : "rgba(255,255,255,0.4)",
                  }}
                >
                  <div style={{ fontSize: 16, marginBottom: 2 }}>{opt.emoji}</div>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !form.business_name || !form.category || !form.city || !form.visit_frequency}
            style={{
              padding: "13px", background: submitting ? "rgba(16,185,129,0.5)" : "#10B981",
              color: "#fff", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 800,
              cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit",
            }}
          >
            {submitting ? "Wird gespeichert…" : "Vorschlag absenden →"}
          </button>
        </form>
      )}

      {/* Category filter pills */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {["Alle", ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat === "Alle" ? null : cat)}
            style={{
              whiteSpace: "nowrap", padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600,
              border: "none", cursor: "pointer", fontFamily: "inherit",
              background: (categoryFilter === cat || (!categoryFilter && cat === "Alle"))
                ? "#10B981" : "rgba(255,255,255,0.07)",
              color: (categoryFilter === cat || (!categoryFilter && cat === "Alle"))
                ? "#fff" : "rgba(255,255,255,0.45)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Suggestions list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "30px", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Lädt…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>💡</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>Noch keine Vorschläge</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 4 }}>Sei der Erste!</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((s, i) => {
            const hasVoted = votedIds.has(s.id);
            const statusCfg = STATUS_CONFIG[s.status] || STATUS_CONFIG.offen;
            return (
              <div key={s.id} style={{ background: "#1a2530", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                {/* Rank */}
                <div style={{ fontSize: 12, fontWeight: 800, color: i < 3 ? ["#F59E0B","#94A3B8","#CD7F32"][i] : "rgba(255,255,255,0.2)", minWidth: 20, textAlign: "center" }}>
                  {i < 3 ? ["🥇","🥈","🥉"][i] : `${i + 1}`}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.business_name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{s.category}</span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>·</span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>📍 {s.city}</span>
                    {s.visit_frequency && (
                      <>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>·</span>
                        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                          {FREQUENCY_OPTIONS.find(f => f.value === s.visit_frequency)?.emoji} {s.visit_frequency}
                        </span>
                      </>
                    )}
                  </div>
                  {/* Status badge */}
                  <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, borderRadius: 8, padding: "3px 9px" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: statusCfg.color }}>{statusCfg.label}</span>
                  </div>
                </div>

                {/* Vote button */}
                <button
                  onClick={() => handleVote(s)}
                  disabled={hasVoted}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    background: hasVoted ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)",
                    border: hasVoted ? "1.5px solid rgba(16,185,129,0.4)" : "1.5px solid rgba(255,255,255,0.1)",
                    borderRadius: 12, padding: "8px 12px", cursor: hasVoted ? "default" : "pointer",
                    fontFamily: "inherit", minWidth: 52,
                  }}
                >
                  <span style={{ fontSize: 14 }}>{hasVoted ? "✅" : "👍"}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: hasVoted ? "#10B981" : "#fff" }}>{s.votes || 1}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Stimmen</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}