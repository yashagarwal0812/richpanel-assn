import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInfo } from "../lib/api";
import axios from "axios";
import '../styles/Facebook.css';


export function Facebook() {
    const navigate = useNavigate();
    const [isConnected, setIsConnected] = useState(false);
    const [pageName, setPageName] = useState('')

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token) return;
        const fetchInfo = async () => {
            try{
                const response = await getInfo(token);
                if(response.isConnected){
                    setIsConnected(true);
                    setPageName(response.name);
                }
            } catch (error) {
            console.error("Error fetching info:", error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("token");
                navigate("/signin");
            }
        }
        };
        fetchInfo();
    }, []); // Add 'navigate' to the dependency array

    const handleDeleteIntegration = async () => {
      // Logic for deleting the integration
      const API_URL = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem("token");
      if(!token) return;
      await axios.get(`${API_URL}/api/facebook/disconnect`, {
            headers: {
                Authorisation: `${token}`,
            },
        });
        setIsConnected(false);
        setPageName('');
    };

    const goToDashboard = () => {
      navigate('/dashboard');
    };

    const connectPage = () => {
      // Logic for connecting the page
      navigate('/connectform');
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate('/signin', { replace: true });
    };

    return (
        <div className="signup-container">
          <div className="signup-box">
            <h1>Facebook Page Integration</h1>
            {isConnected ? (
              <>
                <h1>Integrated Page: <span className="bold">{pageName}</span></h1>
                <div className="button-group">
                  <button className="delete" onClick={handleDeleteIntegration}>Delete Integration</button>
                  <button className="connect" onClick={goToDashboard}>Go to Dashboard</button>
                </div>
              </>
            ) : (
              <button className="connect" onClick={connectPage}>Connect Page</button>
            )}
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
    )

}