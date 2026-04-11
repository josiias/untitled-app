import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Phone, Check, X, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useParams } from "react-router-dom";

export default function ScanStamp() {
  const { businessId } = useParams();
  const [step, setStep] = useState("phone"); // phone | qrcode | success
  const [phone, setPhone] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [business, setBusiness] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const phoneInputRef = useRef(null);

  // Business-Daten laden
  useEffect(() => {
    const loadBusiness = async () => {
      try {
        const biz = await base44.entities.Business.filter({ id: businessId }, "-created_date", 1);
        if (biz.length > 0) {
          setBusiness(biz[0]);
        }
      } catch (err) {
        setError("Fehler beim Laden des Geschäfts");
      } finally {
        setLoading(false);
      }
    };
    if (businessId) loadBusiness();
  }, [businessId]);

  // Prüft ob heute schon ein Stempel gegeben wurde
  const hasStampToday = async (customerId) => {
    const today = new Date().toISOString().split("T")[0];
    const transactions = await base44.entities.StampTransaction.filter({
      customer_id: customerId,
      business_id: businessId
    }, "-created_date", 1);
    
    if (transactions.length > 0) {
      const transactionDate = transactions[0].created_date.split("T")[0];
      return transactionDate === today;
    }
    return false;
  };

  // Findet oder erstellt Kunde anhand Telefon
  const findOrCreateCustomer = async (phoneNumber) => {
    const customers = await base44.entities.Customer.filter({
      phone: phoneNumber,
      business_id: businessId
    }, "-created_date", 1);
    
    if (customers.length > 0) {
      return customers[0];
    }
    
    // Neuer Kunde
    return await base44.entities.Customer.create({
      name: `Kunde ${phoneNumber}`,
      phone: phoneNumber,
      business_id: businessId,
      referral_code: `REF-${Math.random().toString(36).substring(7).toUpperCase()}`,
      total_stamps: 0,
      total_visits: 0,
      provision_earned: 0,
      provision_paid: 0
    });
  };

  // Erstellt ReferralPayout wenn nötig
  const checkAndCreatePayout = async (cust) => {
    if (!cust.referred_by) return;
    
    const payoutsExist = await base44.entities.ReferralPayout.filter({
      new_customer_id: cust.id,
      business_id: businessId
    }, "-created_date", 1);
    
    if (payoutsExist.length === 0 && cust.total_visits >= business.payout_threshold_visits) {
      const minRevenue = business.min_purchase_amount * business.payout_threshold_visits;
      let amount = 0;
      
      if (business.provision_type === "percentage") {
        amount = (minRevenue * business.provision_value / 100);
      } else {
        amount = business.provision_value;
      }
      
      await base44.entities.ReferralPayout.create({
        referrer_customer_id: cust.referred_by,
        new_customer_id: cust.id,
        business_id: businessId,
        amount: amount,
        status: "offen"
      });
    }
  };

  // Telefonnummer eingeben → QR-Code generieren
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const cust = await findOrCreateCustomer(phone);
      
      // Prüfe ob heute schon gestempelt wurde
      const alreadyToday = await hasStampToday(cust.id);
      if (alreadyToday) {
        setError("Dieser Kunde hat heute schon einen Stempel erhalten");
        setLoading(false);
        return;
      }
      
      setCustomer(cust);
      const newSessionId = `${cust.id}-${Date.now()}`;
      setSessionId(newSessionId);
      
      // Generiere QR-Code mit API
      const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(newSessionId)}`;
      setQrCodeUrl(qrDataUrl);
      setStep("qrcode");
    } catch (err) {
      setError(err.message || "Fehler beim Vorbereiten des Stempels");
    } finally {
      setLoading(false);
    }
  };

  // Mitarbeiter scannt QR-Code und bestätigt
  const handleConfirmStamp = async () => {
    if (!customer || !sessionId) return;
    
    try {
      setLoading(true);
      
      await base44.entities.StampTransaction.create({
        customer_id: customer.id,
        business_id: businessId,
        employee_confirmed: true,
        amount: business.min_purchase_amount
      });
      
      const newVisits = customer.total_visits + 1;
      const newStamps = customer.total_stamps + 1;
      
      const updatedCustomer = await base44.entities.Customer.update(customer.id, {
        total_visits: newVisits,
        total_stamps: newStamps
      });
      
      await checkAndCreatePayout(updatedCustomer);
      
      setCustomer(updatedCustomer);
      setStep("success");
    } catch (err) {
      setError("Fehler beim Speichern des Stempels");
    } finally {
      setLoading(false);
    }
  };



  if (loading && !business) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)" }}>
        <Loader2 size={32} color="#10B981" style={{ animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (!business) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)", padding: "24px" }}>
        <div style={{ textAlign: "center", color: "#ef4444" }}>
          <p style={{ fontSize: 16, fontWeight: 600 }}>Geschäft nicht gefunden</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <button onClick={() => window.history.back()} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={20} color="#10B981" />
        </button>
        <div>
          <div style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", fontWeight: 500 }}>Stempelkarte</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1f2937" }}>{business.name}</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        {error && (
          <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", background: "#fee2e2", border: "1px solid #fca5a5", color: "#dc2626", padding: "12px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, maxWidth: 300, zIndex: 50, textAlign: "center" }}>
            {error}
          </div>
        )}

        {step === "phone" && (
          <div style={{ maxWidth: 320, width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ width: 64, height: 64, background: "#10B981", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#fff", fontSize: 28 }}>
                🎫
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1f2937", margin: 0 }}>Dein Stempel wird vorbereitet</h1>
              <p style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", marginTop: 8 }}>Gib deine Telefonnummer ein</p>
            </div>

            <form onSubmit={handlePhoneSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <input 
                  ref={phoneInputRef}
                  type="tel" 
                  inputMode="numeric"
                  placeholder="0151 12345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "14px 12px",
                    fontSize: 18,
                    border: "2px solid rgba(0,0,0,0.12)",
                    borderRadius: 12,
                    fontFamily: "inherit",
                    outline: "none",
                    transition: "border 0.2s",
                    textAlign: "center",
                    letterSpacing: "0.5px"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#10B981"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(0,0,0,0.12)"} 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || !phone}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: loading || !phone ? "#d1d5db" : "#10B981",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  borderRadius: 10,
                  border: "none",
                  cursor: loading || !phone ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8
                }}
                onMouseEnter={(e) => !loading && phone && (e.target.style.background = "#059669")}
                onMouseLeave={(e) => !loading && phone && (e.target.style.background = "#10B981")}>
                {loading ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : "QR-Code generieren"}
              </button>
            </form>
          </div>
        )}

        {step === "qrcode" && (
          <div style={{ maxWidth: 320, width: "100%" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1f2937", margin: "0 0 8px" }}>Zeige diesen Code dem Mitarbeiter</h2>
              <p style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", margin: 0 }}>Mitarbeiter scannt deinen persönlichen QR-Code</p>
            </div>

            <div style={{ background: "rgba(16,185,129,0.08)", border: "2px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: 24, marginBottom: 24, textAlign: "center" }}>
              {qrCodeUrl && (
                <img src={qrCodeUrl} alt="QR Code" style={{ maxWidth: "100%", height: "auto" }} />
              )}
            </div>

            <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 12, padding: 16, marginBottom: 24, textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", marginBottom: 4 }}>Mindestkaufbetrag:</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#10B981" }}>{business.min_purchase_amount}€</div>
            </div>

            <button 
              onClick={() => { setStep("phone"); setPhone(""); setQrCodeUrl(null); setSessionId(null); }}
              style={{
                width: "100%",
                padding: "12px",
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.12)",
                color: "#6b7280",
                fontWeight: 700,
                fontSize: 14,
                borderRadius: 10,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.background = "rgba(0,0,0,0.04)"}
              onMouseLeave={(e) => e.target.style.background = "#fff"}>
              Zurück
            </button>
          </div>
        )}

        {step === "success" && (
          <div style={{ maxWidth: 320, width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 80, height: 80, background: "rgba(16,185,129,0.12)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#10B981", fontSize: 40, animation: "bounce 0.6s ease-in-out" }}>
                ✅
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1f2937", margin: "0 0 8px" }}>Stempel erfolgreich gesammelt!</h2>
              <p style={{ fontSize: 14, color: "rgba(0,0,0,0.6)", marginBottom: 32 }}>Fortschritt: {customer.total_stamps}/{business.stamps_required}</p>
            </div>

            <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))", border: "2px solid rgba(16,185,129,0.3)", borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
                {Array.from({ length: business.stamps_required }).map((_, i) => (
                  <div key={i} style={{
                    aspectRatio: "1/1",
                    background: i < customer.total_stamps ? "#10B981" : "rgba(16,185,129,0.15)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: i < customer.total_stamps ? "#fff" : "rgba(0,0,0,0.2)"
                  }}>
                    {i < customer.total_stamps ? "✓" : ""}
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => { setStep("phone"); setPhone(""); setQrCodeUrl(null); setSessionId(null); }} style={{
              width: "100%",
              padding: "12px",
              background: "#10B981",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
              onMouseEnter={(e) => e.target.style.background = "#059669"}
              onMouseLeave={(e) => e.target.style.background = "#10B981"}>
              Neuer Stempel
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}