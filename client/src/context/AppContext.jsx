import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

const API_BASE = "/api";

export const AppProvider = ({ children }) => {
  const [upcomingPatients, setUpcoming] = useState([]);
  const [visitedPatients, setVisited] = useState([]);

  const [adminLogged, setAdminLogged] = useState(false);

  // Initialize admin login state on component mount
  useEffect(() => {
    // Clear any existing admin login state on initial load
    localStorage.removeItem("adminLogged");
    setAdminLogged(false);
  }, []);

  const loginAdmin = () => {
    setAdminLogged(true);
    localStorage.setItem("adminLogged", "true");
  };

  const logoutAdmin = () => {
    // Clear all patient data
    setUpcoming([]);
    setVisited([]);

    // Clear admin state
    setAdminLogged(false);

    // Clear local storage
    localStorage.removeItem("adminLogged");

    // Force a hard refresh to ensure clean state
    window.location.href = '/';
  };

  // Fetch patients from backend
  const loadPatients = async () => {
    try {
      const [queueRes, completedRes] = await Promise.all([
        fetch(`${API_BASE}/patients?status=in-queue`),
        fetch(`${API_BASE}/patients?status=completed`),
      ]);

      const queueData = await queueRes.json();
      const completedData = await completedRes.json();

      setUpcoming(queueData);
      setVisited(completedData);
    } catch (err) {
      console.error("Error loading patients", err);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // Add patient → POST /api/patients
  const addPatient = async (p) => {
    try {
      const response = await fetch(`${API_BASE}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });

      if (!response.ok) {
        throw new Error('Failed to add patient');
      }

      const newPatient = await response.json();

      // Update the state directly with the new patient
      setUpcoming(prev => [...prev, newPatient]);

    } catch (err) {
      console.error("Error adding patient", err);
      throw err; // Re-throw the error to handle it in the component if needed
    }
  };

  // Next patient → PATCH /api/patients/next
  const nextPatient = async () => {
    if (upcomingPatients.length === 0) return; // No patients to process

    const nextPatient = upcomingPatients[0];

    try {
      // Make the API call first
      const response = await fetch(`${API_BASE}/patients/next`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error('Failed to update patient status');
      }

      // Only update the UI after successful API call
      setUpcoming(prev => prev.slice(1));
      setVisited(prev => [nextPatient, ...prev]);

    } catch (err) {
      console.error("Error moving next patient", err);
      // Re-fetch to ensure UI is in sync with server
      await loadPatients();
      throw err; // Re-throw to allow handling in the component if needed
    }
  };

  // Reset all → DELETE /api/patients
  const resetAll = async () => {
    try {
      await fetch(`${API_BASE}/patients`, {
        method: "DELETE",
      });
      await loadPatients();
    } catch (err) {
      console.error("Error resetting", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        upcomingPatients,
        visitedPatients,
        addPatient,
        nextPatient,
        resetAll,

        adminLogged,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
