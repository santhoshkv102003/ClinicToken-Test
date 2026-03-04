import axios from "axios";
import { useState, useRef, useEffect } from "react";
import '../styles/booking.css';

const BookingForm = ({ onBack, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    treatment: ""
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const optionsRef = useRef(null);

  // Handle smooth scrolling when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && optionsRef.current) {
      // Small timeout to ensure the dropdown is rendered before scrolling
      const timer = setTimeout(() => {
        if (optionsRef.current) {
          optionsRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
          });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const departments = [
    "General",
    "Pediatrics",
    "Cardiology",
    "ENT (Ear, Nose, Throat)",
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Radiology",
    "Others"
  ];

  const handleSelectDepartment = (dept) => {
    setForm({ ...form, treatment: dept });
    setIsDropdownOpen(false);
  };

  const handleChange = (e) => {
    setForm({ 
      ...form, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "/api/patients",
        { 
          name: form.name,
          age: Number(form.age),
          phone: form.phone,
          treatment: form.treatment 
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setForm({
        name: "",
        age: "",
        phone: "",
        treatment: ""
      });

      if (onSubmit) onSubmit(form);
      onBack();

    } catch (err) {
      console.error("❌ Error saving patient:", err);
      alert("Failed to save patient. Check your server.");
    }
  };

  return (
    <div className="form-wrapper">   {/* ✅ CENTERING DIV */}
      <form onSubmit={handleSubmit} className="glass-form">

        <h2>Patient Booking</h2>

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <div className="form-group" ref={dropdownRef}>
          <div ref={optionsRef} className="dropdown-scroll-anchor" />
          <div ref={optionsRef} />
          <button 
            type="button"
            className={`department-button ${isDropdownOpen ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <span className="button-text">
              {form.treatment || 'Select Department'}
            </span>
            <svg 
              className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="dropdown-options">
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  className={`dropdown-option ${form.treatment === dept ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectDepartment(dept);
                  }}
                >
                  {dept}
                </button>
              ))}
            </div>
          )}
          
          <input 
            type="hidden" 
            name="treatment" 
            value={form.treatment} 
            required 
          />
        </div>

        <button type="submit" className="submit-btn">Submit</button>
        <button type="button" className="back-btn" onClick={onBack}>
          Back
        </button>

      </form>
    </div>
  );
};

export default BookingForm;
