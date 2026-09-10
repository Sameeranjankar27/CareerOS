import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      login(response.data.user, response.data.token);

      setMessage(response.data.message);

      // Go to dashboard after successful login
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* LEFT SIDE */}

        <div className="auth-brand">
          <div className="auth-brand-content">

            <div className="auth-logo">
              CareerOS
            </div>

            <h1>
              Your career.
              <br />
              Organized.
            </h1>

            <p>
              Track applications, prepare for interviews,
              and take control of your job search.
            </p>

            <div className="auth-feature">
              <span>✓</span>
              <p>Track every job application</p>
            </div>

            <div className="auth-feature">
              <span>✓</span>
              <p>Manage your career progress</p>
            </div>

            <div className="auth-feature">
              <span>✓</span>
              <p>AI-powered preparation coming soon</p>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="auth-form-section">

          <div className="auth-form-container">

            <div className="auth-mobile-logo">
              CareerOS
            </div>

            <h2>Welcome back</h2>

            <p className="auth-subtitle">
              Sign in to continue to your CareerOS account.
            </p>

            <form
              className="auth-form"
              onSubmit={handleLogin}
            >

              <div className="auth-field">
                <label>Email</label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              <div className="auth-field">
                <label>Password</label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-button"
              >
                Sign In
              </button>

            </form>

            {message && (
              <div className="success-message">
                ✓ {message}
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <p className="auth-footer">
              Don't have an account?{" "}
              <Link to="/register">
                Create one
              </Link>
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Login;