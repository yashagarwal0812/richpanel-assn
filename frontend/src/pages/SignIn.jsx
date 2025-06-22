import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/SignIn.css'

export function SignIn({ onSignIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      console.log(import.meta.env.VITE_BACKEND_URL);
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        formData
      );
      console.log(response.data.token)
      if (response.data.token) {
        const token = `Bearer ${response.data.token}`
        localStorage.setItem("token", token);
        onSignIn();
        navigate("/");
      }
    } catch (error) {

      console.log(error);
      setErrorMessage("Invalid credentials. Please try again.");
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
        <h1>Login to your account</h1>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Sign In</button>
        </form>
        <div className="footer-text">
          <p>
            New to My App? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}