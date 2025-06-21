import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/ConnectForm.css';

export function ConnectForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    appId: "",
    appSecret: "",
    userAccessToken: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/facebook/getlist`,
        formData,
        {
          headers: {
            Authorisation: localStorage.getItem("token"),
          },
        }
      );
      navigate("/connection", { state: response.data });
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="connectform-container">
      <div className="connectform-box">
        <h1>Connect Form</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="appId">App ID</label>
          <input
            type="text"
            id="appId"
            name="appId"
            value={formData.appId}
            onChange={handleChange}
            required
          />
          <label htmlFor="appSecret">App Secret</label>
          <input
            type="text"
            id="appSecret"
            name="appSecret"
            value={formData.appSecret}
            onChange={handleChange}
            required
          />
          <label htmlFor="userAccessToken">User Access Token</label>
          <input
            type="text"
            id="userAccessToken"
            name="userAccessToken"
            value={formData.userAccessToken}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}