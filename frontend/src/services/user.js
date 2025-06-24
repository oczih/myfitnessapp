import axios from 'axios'


const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/api/users`;

export const getAuthHeader = () => {
  const stored = localStorage.getItem('loggedFitnessappUser');
  if (!stored) return {};

  try {
    const parsed = JSON.parse(stored);
    if (!parsed.token) return {};
    return { Authorization: `Bearer ${parsed.token}` };
  } catch {
    return {};
  }
};


const fetchFullUser = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};
const getUsers = async () => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeader(),
  })
  return response.data
}
const update = async (id, newData) => {
  const config = {
    headers: getAuthHeader(),
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
  
  if (foodData.calories === undefined || foodData.calories === null) {
  return response.status(400).json({ error: "Missing calories" });
  }
  const response = await axios.post(`${API_URL}/${id}/foods`, foodData, {
    headers: getAuthHeader(),
  });
  return response.data;
};
const deleteFood = async (id, foodId) => {

  const config = {
    headers: getAuthHeader(),
  };

  try {
    const response = await axios.delete(`${API_URL}/${id}/foods/delete/${foodId}`, config);
    return response.data;
  } catch (error) {
    console.error("Failed to delete food item:", error);
    throw error;
  }
};
export default {
  fetchFullUser,
  update,
  postFood,
  deleteFood,
  getUsers
};