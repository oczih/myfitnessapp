import axios from 'axios'


const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/api/users`;


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const fetchFullUser = async (id, token) => {
    const response = await axios.get(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const update = async (id, newData) => {
    const config = {
      headers: { Authorization: token },
    }
    try {
      console.log("Here's the id:",id)
      const response = await axios.put(`${API_URL}/${id}`, newData, config);
      return response.data;
    } catch (error) {
      console.error("Update failed:", error);
      throw error;
    }
  };

export default {
  fetchFullUser,
  setToken,
  update
};