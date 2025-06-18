import axios from 'axios'

export const fetchFullUser = async (id, token) => {
    const response = await axios.get(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };