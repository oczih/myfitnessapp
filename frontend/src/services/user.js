import axios from 'axios'


const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/api/users`;


let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const fetchFullUser = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};

const update = async (id, newData) => {
  if (!token) {
    throw new Error('No token set. Use setToken(token) before calling update.');
  }

  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.put(`${API_URL}/${id}`, newData, config);
    return response.data;
  } catch (error) {
    console.error("Update failed:", error);
    throw error;
  }
};

const postFood = async (id, foodData) => {
  if (!token) {
    throw new Error('No token set. Use setToken(token) before calling postFood.');
  }

  const config = {
    headers: { Authorization: token },
  };

  try {
    const response = await axios.post(`${API_URL}/${id}/foods`, foodData, config);
    return response.data;
  } catch (error) {
    console.error("Failed to post food item:", error);
    throw error;
  }
};
const deleteFood = async (id, foodData, index) => {
  if(!token) {
    throw new Error('No token set. Use setToken(token) before calling deleteFood.');
  }
  
  const config = {
    headers: { Authorization: token },
  };
  try {
    const response = await axios.delete(`${API_URL}/${id}/foods/${index}`, foodData, config)
    return response.data
  }catch(error){
    console.error("Failed to delete food item:", error);
    throw error;
  }
}
export default {
  fetchFullUser,
  setToken,
  update,
  postFood,
  deleteFood
};