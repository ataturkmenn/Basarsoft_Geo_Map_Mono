import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:5290/swagger/index.html', 
});

export default api;
