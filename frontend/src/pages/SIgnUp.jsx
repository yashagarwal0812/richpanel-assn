import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/SignUp.css';

export function SignUp({ onSignUp }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        formData
      );
      if (response.data.token) {
        const token = `Bearer ${response.data.token}`;
        localStorage.setItem("token", token);
        onSignUp();
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="remember-me">
            <input type="checkbox" id="rememberMe" name="rememberMe" />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <div className="footer-text">
          <p>
            Already have an account? <a href="/signin">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}