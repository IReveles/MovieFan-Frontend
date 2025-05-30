import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.DEV
    ? 'http://localhost:8080'
    : 'https://moviefan-backend.onrender.com', // replace with your deployed backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
