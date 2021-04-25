import axios from 'axios';

const apiService = axios.create({
  baseURL: 'https://podcastr-gabriel-oak.vercel.app/api',
});

export default apiService;