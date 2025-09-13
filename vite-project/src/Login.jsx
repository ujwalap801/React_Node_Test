import { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";


function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    if (!formElement.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/login", form);

      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-gradient">
      <div className="card shadow-lg p-4 rounded" style={{ width: "400px" }}>
        <h3 className="text-center mb-3 text-primary">Login</h3>

        <form
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          noValidate
          onSubmit={handleSubmit}
        >
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">Please enter a valid email</div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            <div className="invalid-feedback">
              Password must be at least 6 characters
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 mb-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Register Redirect */}
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate("/register")}
          >
            Don’t have an account? Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
