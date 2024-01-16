import axios from '../axios';
import { ILoginInput } from '../types';

export const register = async (data: FormData) => {
  const response = await axios.post('/api/register', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const login = async (data: ILoginInput) => {
  const response = await axios.post('/api/login', data);
  return response.data;
};
