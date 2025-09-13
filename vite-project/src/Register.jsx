import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
  });
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

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await res.json();
      console.log("Backend response:", data);

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-gradient">
      <div className="card shadow-lg p-4 rounded" style={{ width: "400px" }}>
        <h3 className="text-center mb-3 text-primary">Sign Up</h3>
        <form
          className={`needs-validation ${validated ? "was-validated" : ""}`}
          noValidate
          onSubmit={handleSubmit}
        >
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
              minLength="3"
            />
            <div className="invalid-feedback">
              Name must be at least 3 characters
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">
              Please enter your date of birth
            </div>
          </div>

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

          <button
            type="submit"
            className="btn btn-primary w-100 mb-2"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Already registered? Sign in */}
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate("/login")}
          >
            Already have an account? Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
