import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Function to refresh access token
const refreshAcessToken = async () => {
  try {
    await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/refresh-token`,
      { withCredentials: true } // cookie sent automatically
    );
    
    return true;
  } catch (error) {
    console.error('Refresh token failed', error);
    return false;
  }
};

// Response interceptor to handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry once if 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshed = await refreshAcessToken();
      if (refreshed) {
        return api(originalRequest); // retry original request
      }
    }

    return Promise.reject(error);
  }
);

export default api;
