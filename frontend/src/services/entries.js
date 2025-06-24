import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/api/entries`;

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}


const getAll = async () => {
    const { data } = await axios.get(API_URL);
    return data;
}

const getById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;}

    catch(error){
      console.log(error)
}
}
const createEntry = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  try {
    const response = await axios.post(API_URL, newObject, config);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Failed to create entry:", error);
    throw error;
  }
};
const update = async (id, newData) => {
  const config = {
    headers: { Authorization: token },
  }
  try {
    const response = await axios.put(`${API_URL}/${id}`, newData, config);
    return response.data;
  } catch (error) {
    console.error("Update failed:", error);
    throw error;
  }
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  try {
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
};
export default {
  getAll,
  getById,
  createEntry,
  setToken,
  remove,
  update
};