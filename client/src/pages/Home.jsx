import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import BookingForm from "../components/BookingForm";
import "../styles/home.css";

import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

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

const Home = () => {
  const { addPatient, adminLogged, visitedPatients, upcomingPatients, consultingPatient, averageTime } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const totalWait = Math.round((upcomingPatients.length + (consultingPatient ? 1 : 0)) * averageTime);

  const handleSubmit = async (data) => {
    try {
      await addPatient(data);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding patient:", error);
    }
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

        <main className="cq-main">
          {!showForm ? (
            <>
              {/* Stat cards */}
              <Cards
                completed={visitedPatients.length}
                queue={upcomingPatients.length + (consultingPatient ? 1 : 0)}
                wait={totalWait}
                avgTime={averageTime}
              />

              {/* Action buttons */}
              <div className="home-actions">
                <button
                  className="cq-btn cq-btn-primary"
                  onClick={(e) => { addRipple(e); setShowForm(true); }}
                >
                  Patient Booking
                </button>

                <button
                  className="cq-btn cq-btn-secondary"
                  onClick={(e) => { addRipple(e); navigate(adminLogged ? "/admin" : "/login"); }}
                >
                  Admin Login
                </button>
              </div>
            </>
          ) : (
            <div className="home-booking-wrap">
              <BookingForm
                onSubmit={handleSubmit}
                onBack={() => setShowForm(false)}
              />
            </div>
          )}
        </main>

        <footer className="cq-footer">
          © 2026 CLINICQUEUE &nbsp;·&nbsp; TOKEN MANAGEMENT SYSTEM &nbsp;·&nbsp; ALL RIGHTS RESERVED
        </footer>
      </div>
    </>
  );
};

export default Home;
