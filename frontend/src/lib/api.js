import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function getInfo(token) {
	const response = await axios.get(`${API_URL}/api/facebook/getinfo`, {
		headers: {
			Authorisation: `${token}`,
		},
	});
    console.log(response.data);
	return response.data;
}