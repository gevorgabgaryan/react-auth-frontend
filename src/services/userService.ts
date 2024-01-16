import axios from '../axios';

export const getUserProfile = async () => {
  const response = await axios.get('/api/users/me');
  return response.data;
};
