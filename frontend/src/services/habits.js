import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const API_URL = `${API_BASE_URL}/api/habits`;

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}


const getAll = async () => {
    const { data } = await axios.get(API_URL);
    return data;
}

const getById = async (id) => {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data;
}
const createHabit = async newObject => {
    const config = {
        headers: {Authorization: token}
    }
    const response = await axios.post(API_URL, newObject, config);
    return response.data;
}
const update = (id, newData) => {
  return axios.put(`${API_URL}/${id}`, newData).then(response => response.data);
};

const remove = id => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(`${API_URL}/${id}`, config)
  return request.then(response => response.data)
}
export default {getAll
, getById, createHabit, setToken, remove, update}