import axios from 'axios';

const apiService = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export default apiService;