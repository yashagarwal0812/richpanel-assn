import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function getInfo(token) {
	try {
		const response = await axios.get(`${API_URL}/api/facebook/getinfo`, {
			headers: {
				Authorisation: `${token}`,
			},
		});
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error("Error fetching info:", error);
		if (error.response && error.response.status === 401) {
			localStorage.removeItem("token");
			window.location.href = "/signin";
		}
		throw error;
	}
}