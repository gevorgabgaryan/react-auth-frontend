import axios from "../axios";

export const register = async (data: FormData) => {
  const response = await axios.post('/api/register', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

