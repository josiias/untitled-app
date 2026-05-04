import { Link } from "react-router-dom";

export default function Impressum() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a1410", fontFamily: "'Inter', sans-serif", color: "#fff", padding: "0 0 80px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); * { box-sizing: border-box; }`}</style>

      {/* Navbar */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,20,16,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ fontSize: 22, fontWeight: 900, color: "#fff", textDecoration: "none" }}>Sensalie<span style={{ color: "#10B981" }}>.</span></Link>
        <Link to="/" style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>← Zurück</Link>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px" }}>
        <h1 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, marginBottom: 8 }}>Impressum</h1>
        <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: 48, fontSize: 14 }}>Angaben gemäß § 5 TMG</div>

        {[
          {
            title: "Verantwortlich",
            content: (
              <>
                <p>Sensalie GmbH (in Gründung)</p>
                <p>Musterstraße 1</p>
                <p>10115 Berlin</p>
                <p>Deutschland</p>
              </>
            ),
          },
          {
            title: "Kontakt",
            content: (
              <>
                <p>E-Mail: <a href="mailto:info@sensalie.de" style={{ color: "#10B981" }}>info@sensalie.de</a></p>
              </>
            ),
          },
          {
            title: "Vertreten durch",
            content: <p>Geschäftsführung: [Name eintragen]</p>,
          },
          {
            title: "Umsatzsteuer-ID",
            content: <p>Umsatzsteuer-Identifikationsnummer gemäß §27a UStG: [USt-ID eintragen]</p>,
          },
          {
            title: "Haftungsausschluss",
            content: (
              <>
                <p style={{ marginBottom: 10 }}>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>
                <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.</p>
              </>
            ),
          },
          {
            title: "Urheberrecht",
            content: <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>,
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#10B981", marginBottom: 12 }}>{section.title}</h2>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.8 }}>
              {section.content}
            </div>
          </div>
        ))}

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32, display: "flex", gap: 20 }}>
          <Link to="/datenschutz" style={{ color: "#10B981", fontSize: 14, textDecoration: "none", fontWeight: 600 }}>Datenschutzerklärung →</Link>
          <Link to="/" style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, textDecoration: "none" }}>Zurück zur Startseite</Link>
        </div>
      </div>
    </div>
  );
}