import axios from 'axios';

const API = axios.create({
  baseURL: 'https://coder-vibe.onrender.com/api',
});

export default API;