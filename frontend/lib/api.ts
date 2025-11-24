import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const shouldSkipRedirect = (() => {
        const url = error.config?.url || "";
        const authEndpoints = [
          "/admins/login",
          "/admins/register",
          "/students/login",
          "/students/register",
        ];
        const isAuthRequest = authEndpoints.some((endpoint) =>
          url.includes(endpoint)
        );

        const isAuthPage =
          typeof window !== "undefined" &&
          window.location.pathname.includes("/auth/");

        return isAuthRequest || isAuthPage;
      })();

      if (!shouldSkipRedirect) {
        localStorage.removeItem("token");
        window.location.href = "/admin/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
