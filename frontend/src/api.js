import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend server
});

export default API;
