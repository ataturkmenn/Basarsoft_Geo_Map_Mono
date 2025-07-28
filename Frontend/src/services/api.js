import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7042/swagger/index.html', 
});

export default api;
