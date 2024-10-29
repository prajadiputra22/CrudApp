import axios from 'axios';

const api = axios.create({
  baseURL: 'https://671f7dd1e7a5792f052e711f.mockapi.io/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
