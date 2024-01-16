import axios from 'axios';
import { SERVER_URL } from '../utils/constants';

export default axios.create({
  baseURL: SERVER_URL,
});
