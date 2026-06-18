import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this port to match your backend configuration
});

// 👇 UPDATE THE REQUEST INTERCEPTOR TO PARSE THE NEW USER FORMAT
api.interceptors.request.use((config) => {
  const savedUser = localStorage.getItem('user');
  
  if (savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser && parsedUser.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    } catch (error) {
      console.error("Error parsing user object token authorization", error);
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;