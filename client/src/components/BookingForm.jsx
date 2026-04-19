import axios from "axios";
import { useState, useRef, useEffect } from "react";
import "../styles/booking.css";

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

const BookingForm = ({ onBack, onSubmit, isLoading: parentLoading }) => {
  const [form, setForm] = useState({ name: "", age: "", phone: "", treatment: "" });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tokenIssued, setTokenIssued] = useState(null);
  const dropdownRef = useRef(null);

  const departments = [
    "Cardiology",
    "Neurology",
    "Dental",
    "Physiotherapy",
    "Radiology",
    "Orthopedics",
    "General Medicine",
    "Dermatology",
    "ENT (Ear, Nose, Throat)",
    "Pediatrics",
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectDepartment = (dept) => {
    setForm({ ...form, treatment: dept });
    setIsDropdownOpen(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
      try {
        setSubmitting(true);
        const newPatient = await onSubmit(form);
        if (newPatient && newPatient.tokenNumber) {
          setTokenIssued(`T${String(newPatient.tokenNumber).padStart(2, "0")}`);
        } else {
          // Fallback if tokenNumber isn't available for some reason
          setTokenIssued(`T${String(Date.now()).slice(-2)}`);
        }
      } catch (err) {
        console.error("❌ Error saving patient:", err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  // ── Token issued success state ──
  if (tokenIssued) {
    return (
      <div className="booking-wrap">
        <div className="cq-panel booking-panel booking-success">
          <div className="booking-panel-line" />
          <div className="token-display">#{tokenIssued}</div>
          <div className="token-sub">
            YOUR TOKEN HAS BEEN ISSUED<br />
            PLEASE WAIT FOR YOUR TURN
          </div>
          <button
            className="cq-btn cq-btn-secondary booking-submit"
            onClick={(e) => { addRipple(e); onBack(); }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-wrap">
      <div className="cq-panel booking-panel">
        {/* Top gradient line */}
        <div className="booking-panel-line" />

        <div className="booking-hd">
          <h2 className="booking-title">Patient Booking</h2>
          <p className="booking-sub">Register to receive your queue token</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="cq-field">
            <label>Full Name</label>
            <input
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="cq-field">
            <label>Age</label>
            <input
              name="age"
              type="number"
              placeholder="Enter age"
              value={form.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="cq-field">
            <label>Phone Number</label>
            <input
              name="phone"
              placeholder="+91 XXXXX XXXXX"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Custom department dropdown */}
          <div className="cq-field" ref={dropdownRef} style={{ position: "relative" }}>
            <label>Department</label>
            <button
              type="button"
              className={`booking-dept-btn ${isDropdownOpen ? "active" : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="booking-dept-text">
                {form.treatment || "Select Department"}
              </span>
              <svg
                className={`booking-dept-arrow ${isDropdownOpen ? "open" : ""}`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="booking-dropdown">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    className={`booking-dropdown-item ${form.treatment === dept ? "selected" : ""}`}
                    onClick={() => handleSelectDepartment(dept)}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
            <input type="hidden" name="treatment" value={form.treatment} required />
          </div>

          <div className="booking-btns">
            <button
              type="submit"
              className="cq-btn cq-btn-primary booking-submit"
              disabled={submitting || parentLoading}
              onClick={addRipple}
            >
              {submitting ? (
                <>
                  <span className="cq-spinner" /> Booking...
                </>
              ) : (
                "Get Token"
              )}
            </button>

            <button
              type="button"
              className="cq-btn cq-btn-secondary booking-submit"
              onClick={(e) => { addRipple(e); onBack(); }}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
