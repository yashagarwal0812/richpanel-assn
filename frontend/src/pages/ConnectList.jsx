import { useLocation, useNavigate } from "react-router-dom";
import '../styles/ConnectList.css';
import axios from "axios";

export function ConnectList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state || {};

  const handleClick = async (item) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/facebook/connect`,
        {
          pageAccessToken: item.accessToken,
          pageId: item.id,
          pageName: item.name,
          imgUrl: item.url,
        },
        {
          headers: {
            Authorisation: localStorage.getItem("token"),
          },
        }
      );
      navigate("/facebook");
    } catch (error) {
      console.error("Error sending data:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/signin");
      }
    }
  };

  return (
    <div className="connectlist-container">
      <div className="connectlist-box">
        <h1>Connections</h1>
        {data && data.map((item) => (
          <div
            key={item.id}
            className="connectlist-item clickable"
            onClick={() => handleClick(item)}
          >
            <img src={item.url} alt={item.name} className="profile-pic" />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}