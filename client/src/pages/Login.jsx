import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import "../styles/login.css";

const Login = () => {
  const { loginAdmin } = useContext(AppContext);
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = e.target.username.value.trim();
    const pass = e.target.password.value;

    if (!user || !pass) {
      setErr("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setErr("");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (user === "admin" && pass === "1234") {
      loginAdmin();
      navigate("/admin");
    } else {
      setErr("Invalid username or password");
      setIsLoading(false);
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

      <div className="shell login-shell">
        {/* Back button */}
        <button
          className="login-back-btn"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

        <div className="login-card">
          {/* Top gradient line */}
          <div className="login-card-line" />

          {/* Logo */}
          <div className="login-logo-row">
            <div className="logo-mark">♥</div>
            <span className="login-brand">ClinicQueue</span>
          </div>

          <h1 className="login-title">Admin Login</h1>
          <p className="login-sub">Restricted access — staff only</p>
          <p className="login-hint">Username: <strong>admin</strong> &nbsp;|&nbsp; Password: <strong>1234</strong></p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="cq-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="admin@clinicqueue"
                autoComplete="username"
                required
              />
            </div>

            <div className="cq-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {err && (
              <div className="cq-alert cq-alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {err}
              </div>
            )}

            <button
              type="submit"
              className="cq-btn cq-btn-primary login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="cq-spinner" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="login-footer-row">
            <p>
              Don&apos;t have an account?&nbsp;
              <a href="#signup" className="login-link">Contact admin</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
