import Navbar from "../components/Navbar";
import Cards from "../components/Cards";
import BookingForm from "../components/BookingForm";
import "../styles/home.css";

import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { addPatient, adminLogged, visitedPatients, upcomingPatients } = useContext(AppContext);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await addPatient(data);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  return (
    <div className="home-container">
      <Navbar />

      <main className="home-content">
        {!showForm ? (
          <div className="home-hero">
            <div className="stats-container">
              <Cards 
                completed={visitedPatients.length} 
                queue={upcomingPatients.length} 
                wait={upcomingPatients.length * 5} 
              />
            </div>

            <div className="action-buttons">
              <button 
                className="patient-btn"
                onClick={() => setShowForm(true)}
              >
                Patient Booking
              </button>

              <button 
                className="login-btn"
                onClick={() => navigate(adminLogged ? "/admin" : "/login")}
              >
                Admin Login
              </button>
            </div>
          </div>
        ) : (
          <div className="booking-form-container">
            <BookingForm
              onSubmit={handleSubmit}
              onBack={() => setShowForm(false)}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
