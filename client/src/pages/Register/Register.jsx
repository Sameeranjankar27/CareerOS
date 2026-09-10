import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await api.post("/users/register", {
        name,
        email,
        password,
      });

      setMessage(response.data.message);

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
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
              Build your career.
              <br />
              One step at a time.
            </h1>

            <p>
              Organize your job search, track applications,
              and prepare smarter for your next opportunity.
            </p>

            <div className="auth-feature">
              <span>✓</span>
              <p>Track every job application</p>
            </div>

            <div className="auth-feature">
              <span>✓</span>
              <p>Stay organized throughout your search</p>
            </div>

            <div className="auth-feature">
              <span>✓</span>
              <p>Prepare for interviews with AI</p>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="auth-form-section">

          <div className="auth-form-container">

            <div className="auth-mobile-logo">
              CareerOS
            </div>

            <h2>Create your account</h2>

            <p className="auth-subtitle">
              Start organizing your career journey today.
            </p>

            <form
              className="auth-form"
              onSubmit={handleRegister}
            >

              <div className="auth-field">
                <label>Name</label>

                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />
              </div>

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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-button"
              >
                Create Account
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
              Already have an account?{" "}
              <Link to="/login">
                Sign in
              </Link>
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Register;