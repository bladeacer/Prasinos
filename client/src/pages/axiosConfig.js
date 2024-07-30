// src/axiosConfig.js 
import axios from 'axios';

// Function to get the token from local storage
const getToken = () => {
    return localStorage.getItem('token'); // Adjust this according to where you store your token
};

const instance = axios.create({
    baseURL: 'http://localhost:3001', // Backend server running on port 3001
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the Authorization header
instance.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default instance;
