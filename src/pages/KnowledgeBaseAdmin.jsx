import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const CATEGORIES = [
  { value: "stempel",    label: "Stempel",    emoji: "⬛" },
  { value: "provision",  label: "Provision",  emoji: "💸" },
  { value: "praemien",   label: "Prämien",    emoji: "🎁" },
  { value: "partner",    label: "Partner",    emoji: "🏪" },
  { value: "app",        label: "App",        emoji: "📱" },
  { value: "datenschutz",label: "Datenschutz",emoji: "🔒" },
  { value: "allgemein",  label: "Allgemein",  emoji: "💬" },
];

const EMPTY_FORM = { title: "", content: "", category: "allgemein", active: true };

export default function KnowledgeBaseAdmin() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [catFilter, setCatFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.KnowledgeBase.list("-created_date", 200);
    setEntries(data);
    setLoading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (editingId) {
      await base44.entities.KnowledgeBase.update(editingId, form);
    } else {
      await base44.entities.KnowledgeBase.create(form);
    }
    setSaving(false);
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    await load();
  };

  const handleEdit = (entry) => {
    setForm({ title: entry.title, content: entry.content, category: entry.category || "allgemein", active: entry.active !== false });
    setEditingId(entry.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    await base44.entities.KnowledgeBase.delete(id);
    setDeleting(null);
    await load();
  };

  const handleToggleActive = async (entry) => {
    await base44.entities.KnowledgeBase.update(entry.id, { active: !entry.active });
    setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, active: !e.active } : e));
  };

  const filtered = entries.filter(e => {
    const catOk = !catFilter || e.category === catFilter;
    const searchOk = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.content.toLowerCase().includes(search.toLowerCase());
    return catOk && searchOk;
  });

  const activeCount = entries.filter(e => e.active !== false).length;

  return (
    <div style={{ minHeight: "100vh", background: "#0d1a24", fontFamily: "'Inter', sans-serif", color: "#fff" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Bricolage+Grotesque:wght@700;800;900&display=swap'); * { box-sizing: border-box; }`}</style>

      {/* Header */}
      <div style={{ background: "rgba(13,26,36,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 860, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧠</div>
            <div>
              <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 900, color: "#fff" }}>Julia's Wissensdatenbank</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{activeCount} aktive Einträge · Julia lernt aus diesen Daten</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="/dashboard" style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none", padding: "6px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}>← Dashboard</a>
            <button onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(v => !v); }}
              style={{ background: showForm ? "rgba(255,255,255,0.08)" : "#10B981", color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              {showForm ? "✕ Abbrechen" : "+ Neuer Eintrag"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 24px 60px" }}>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSave} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 20, padding: "22px 22px", marginBottom: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 18 }}>
              {editingId ? "✏️ Eintrag bearbeiten" : "➕ Neuer Wissenseintrag"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Category */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 8 }}>Kategorie</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {CATEGORIES.map(c => (
                    <button key={c.value} type="button" onClick={() => setForm(f => ({ ...f, category: c.value }))}
                      style={{ padding: "6px 12px", borderRadius: 10, fontSize: 11, fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit",
                        background: form.category === c.value ? "#10B981" : "rgba(255,255,255,0.07)",
                        color: form.category === c.value ? "#fff" : "rgba(255,255,255,0.5)" }}>
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Frage / Titel *</label>
                <input required type="text" placeholder="z.B. Wie funktioniert das Stempeln?"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 14, color: "#fff", fontFamily: "inherit", outline: "none" }} />
              </div>

              {/* Content */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Antwort / Inhalt *</label>
                <textarea required rows={5} placeholder="Schreibe hier die vollständige, korrekte Antwort..."
                  value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 13, color: "#fff", fontFamily: "inherit", outline: "none", resize: "vertical", lineHeight: 1.6 }} />
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>{form.content.length} Zeichen — je detaillierter, desto besser antwortet Julia</div>
              </div>

              {/* Active toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input type="checkbox" id="activeCheck" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                  style={{ width: 16, height: 16, accentColor: "#10B981", cursor: "pointer" }} />
                <label htmlFor="activeCheck" style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>Eintrag aktiv (Julia verwendet ihn)</label>
              </div>

              <button type="submit" disabled={saving}
                style={{ padding: "13px", background: saving ? "rgba(16,185,129,0.5)" : "#10B981", color: "#fff", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                {saving ? "Wird gespeichert…" : editingId ? "✓ Änderungen speichern" : "Eintrag hinzufügen →"}
              </button>
            </div>
          </form>
        )}

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
          {CATEGORIES.slice(0, 4).map(c => {
            const count = entries.filter(e => e.category === c.value).length;
            return (
              <div key={c.value} onClick={() => setCatFilter(catFilter === c.value ? null : c.value)}
                style={{ background: catFilter === c.value ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)", border: catFilter === c.value ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "12px 14px", cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{c.emoji}</div>
                <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 900, color: catFilter === c.value ? "#10B981" : "#fff" }}>{count}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{c.label}</div>
              </div>
            );
          })}
        </div>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "rgba(255,255,255,0.25)" }}>🔍</span>
            <input type="text" placeholder="Einträge durchsuchen…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "10px 14px 10px 38px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 13, color: "#fff", fontFamily: "inherit", outline: "none" }} />
          </div>
          <select value={catFilter || ""} onChange={e => setCatFilter(e.target.value || null)}
            style={{ padding: "10px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 13, color: "#fff", fontFamily: "inherit", outline: "none", cursor: "pointer" }}>
            <option value="">Alle Kategorien</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>)}
          </select>
        </div>

        {/* Entries list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "rgba(255,255,255,0.3)" }}>Lädt…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 20 }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🧠</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>Noch keine Einträge</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 6 }}>Erstelle deinen ersten Wissenseintrag oben</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              {filtered.length} Einträge{catFilter ? ` · ${CATEGORIES.find(c => c.value === catFilter)?.label}` : ""}
            </div>
            {filtered.map(entry => {
              const cat = CATEGORIES.find(c => c.value === entry.category) || CATEGORIES[6];
              return (
                <div key={entry.id} style={{ background: "#1a2530", border: entry.active !== false ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.03)", borderRadius: 16, padding: "16px 18px", opacity: entry.active !== false ? 1 : 0.5 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 36, height: 36, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{cat.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{entry.title}</div>
                        <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>{cat.label}</div>
                        {entry.active === false && <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 600, color: "#F87171" }}>Inaktiv</div>}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {entry.content}
                      </div>
                    </div>
                    {/* Actions */}
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => handleToggleActive(entry)} title={entry.active !== false ? "Deaktivieren" : "Aktivieren"}
                        style={{ width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer", background: entry.active !== false ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {entry.active !== false ? "✓" : "○"}
                      </button>
                      <button onClick={() => handleEdit(entry)}
                        style={{ width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.07)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(entry.id)} disabled={deleting === entry.id}
                        style={{ width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer", background: "rgba(239,68,68,0.1)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {deleting === entry.id ? "…" : "🗑️"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}