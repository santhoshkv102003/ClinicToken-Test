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

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (user === "admin" && pass === "1234") {
      loginAdmin();
      navigate("/admin");
    } else {
      setErr("Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-glass">
        <div className="login-header">
          <div className="login-logo">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            <h1>SmartToken</h1>
          </div>
          <h2>Welcome</h2>
          <p className="text-muted">Username: admin | Password: 1234</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-group">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="d-flex justify-content-between">
              <label htmlFor="password">Password</label>
              <a href="#forgot" className="forgot-link">Forgot password?</a>
            </div>
            <div className="input-group">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {err && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {err}
            </div>
          )}

          <button
            type="submit"
            className={`btn-primary w-100 ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="#signup">Contact admin</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
