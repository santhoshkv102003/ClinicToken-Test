import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import BookingForm from "../components/BookingForm";
import PatientList from "../components/PatientList";
import "../styles/admin.css";

/* Ripple helper */
function addRipple(e) {
  const btn = e.currentTarget;
  const r = btn.getBoundingClientRect();
  const s = document.createElement("span");
  s.className = "ripple";
  const sz = Math.max(r.width, r.height);
  s.style.cssText = `width:${sz}px;height:${sz}px;left:${e.clientX - r.left - sz / 2}px;top:${e.clientY - r.top - sz / 2}px`;
  btn.appendChild(s);
  setTimeout(() => s.remove(), 550);
}

const Admin = () => {
  const {
    upcomingPatients,
    visitedPatients,
    consultingPatient,
    averageTime,
    addPatient,
    nextPatient,
    resetAll,
    logoutAdmin,
    updateSettings,
    calculateWaitTime,
    getTotalWaitTime,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const [section, setSection] = useState("main");
  const [isLoading, setIsLoading] = useState(false);

  const totalWait = getTotalWaitTime();

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      await addPatient(data);
    } catch (error) {
      console.error("Error adding patient:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  return (
    <>
      {/* Animated background */}
      <div className="bg">
        <div className="grid-lines" />
        <div className="glow-orb orb1" />
        <div className="glow-orb orb2" />
        <div className="glow-orb orb3" />
      </div>

      <div className="shell">
        <Navbar />

        <main className="admin-main-wrap">

          {/* ── Dashboard header ── */}
          <div className="admin-hero">
            <div className="admin-hero-left">
              <span className="admin-badge">
                <span className="chip-dot" />
                ADMIN PANEL
              </span>
              <h1 className="admin-title">Dashboard</h1>
            </div>
            <div className="admin-hero-actions">
              <button
                className="cq-btn cq-btn-secondary admin-hero-btn"
                onClick={(e) => { addRipple(e); navigate("/"); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Home
              </button>

              <button
                className="cq-btn cq-btn-secondary admin-hero-btn"
                onClick={(e) => { addRipple(e); resetAll(); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
                Reset All
              </button>

              <button
                className="cq-btn cq-btn-danger admin-hero-btn"
                onClick={(e) => { addRipple(e); handleLogout(); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* ── MAIN SECTION ── */}
          {section === "main" && (
              <div className="admin-section-main">
                <Cards
                  completed={visitedPatients.length}
                  queue={upcomingPatients.length + (consultingPatient ? 1 : 0)}
                  wait={totalWait}
                  avgTime={averageTime}
                />

                <div className="admin-grid-tier2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div className="cq-panel" style={{ padding: '20px' }}>
                    <div className="admin-list-hd" style={{ marginBottom: '15px' }}>
                      <h2 className="admin-list-title">Live Pace Adjustment</h2>
                      <span className="cq-badge">DYNAMIC</span>
                    </div>
                    <div className="pace-controls" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                        AVERAGE CONSULTATION TIME:
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button 
                          className="cq-btn cq-btn-secondary" 
                          style={{ padding: '4px 12px', minWidth: '40px' }}
                          onClick={() => updateSettings({ averageConsultationTimeMs: Math.max(60000, (averageTime - 1) * 60000) })}
                        >-</button>
                        <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.2rem', minWidth: '80px', textAlign: 'center' }}>
                          {Math.round(averageTime)} min
                        </span>
                        <button 
                          className="cq-btn cq-btn-secondary" 
                          style={{ padding: '4px 12px', minWidth: '40px' }}
                          onClick={() => updateSettings({ averageConsultationTimeMs: (averageTime + 1) * 60000 })}
                        >+</button>
                      </div>
                    </div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '15px' }}>
                    </div>
                  </div>

                  {consultingPatient ? (
                    <div className="admin-current-card cq-panel" style={{ border: '1px solid var(--accent)', display: 'flex', flexDirection: 'column' }}>
                      <div className="admin-list-hd">
                        <h2 className="admin-list-title" style={{ color: 'var(--accent)' }}>Currently Consulting</h2>
                        <span className="cq-badge" style={{ background: 'var(--accent)', color: 'white' }}>IN PROGRESS</span>
                      </div>
                      <div className="consulting-info-box" style={{ 
                        margin: '15px', 
                        padding: '15px', 
                        background: 'rgba(255,255,255,0.03)', 
                        borderRadius: '8px', 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center',
                        fontFamily: 'monospace',
                        fontSize: '1.1rem'
                      }}>
                        <span style={{ color: 'var(--text)' }}>
                          <strong>{consultingPatient.name}</strong> - {consultingPatient.treatment}
                        </span>
                      </div>
                      <div style={{ padding: '0 15px 15px', fontSize: '0.8rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', background: '#00ff00', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #00ff00' }} />
                        SESSION ACTIVE
                      </div>
                    </div>
                  ) : (
                    <div className="cq-panel" style={{ opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                      <p style={{ color: 'var(--text-dim)' }}>Doctor is currently<br/>between patients</p>
                    </div>
                  )}
                </div>

              <div className="admin-nav-grid">
                <button
                  className="cq-btn cq-btn-primary"
                  onClick={(e) => { addRipple(e); setSection("form"); }}
                >
                  Add New Patient
                </button>

                <button
                  className="cq-btn cq-btn-secondary"
                  onClick={(e) => { addRipple(e); setSection("upcoming"); }}
                >
                  Upcoming ({upcomingPatients.length})
                </button>

                <button
                  className="cq-btn cq-btn-secondary"
                  onClick={(e) => { addRipple(e); setSection("visited"); }}
                >
                  Visited ({visitedPatients.length})
                </button>

                <button
                  className="cq-btn cq-btn-primary admin-next-btn"
                  onClick={(e) => { addRipple(e); nextPatient(); }}
                  disabled={upcomingPatients.length === 0 && !consultingPatient}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  {consultingPatient ? "Finish & Next" : "Call Next Patient"}
                </button>
              </div>
            </div>
          )}

          {/* ── BOOKING FORM ── */}
          {section === "form" && (
            <div className="admin-sub-section">
              <BookingForm
                onSubmit={handleSubmit}
                onBack={() => setSection("main")}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* ── UPCOMING LIST ── */}
          {section === "upcoming" && (
            <div className="admin-sub-section">
              <button
                className="admin-back-link"
                onClick={() => setSection("main")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back
              </button>

              <div className="cq-panel">
                <div className="admin-list-hd">
                  <h2 className="admin-list-title">Upcoming Patients</h2>
                  <span className="cq-badge">{upcomingPatients.length} patients</span>
                </div>
                <PatientList list={upcomingPatients} />
              </div>
            </div>
          )}

          {/* ── VISITED LIST ── */}
          {section === "visited" && (
            <div className="admin-sub-section">
              <button
                className="admin-back-link"
                onClick={() => setSection("main")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back
              </button>

              <div className="cq-panel">
                <div className="admin-list-hd">
                  <h2 className="admin-list-title">Visited Patients</h2>
                  <span className="cq-badge">{visitedPatients.length} patients</span>
                </div>
                <PatientList list={visitedPatients} showWaitTime={false} />
              </div>
            </div>
          )}
        </main>

        <footer className="cq-footer">
          © 2026 CLINICQUEUE &nbsp;·&nbsp; ADMIN PANEL &nbsp;·&nbsp; ALL RIGHTS RESERVED
        </footer>
      </div>
    </>
  );
};

export default Admin;
