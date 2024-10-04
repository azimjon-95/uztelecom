import axios from "axios";

const api = axios.create({
  baseURL: 'https://api.uztelecom.dadabayev.uz/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("token")}`
  }
});

// Tokenni yangilash uchun funksiyani yaratamiz
const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    const newToken = response.data.newToken || '';
    localStorage.setItem('token', newToken);
    return newToken;
  } catch (error) {
    console.error("Token yangilanmadi:", error);
    return null;
  }
};

// Axios interceptor qo'shamiz
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Javob interceptorini qo'shamiz
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;















// import axios from "axios";

// const api = axios.create({
//   baseURL: 'https://api.uztelecom.dadabayev.uz/api',
//   headers: {
//     'Authorization': `Bearer ${localStorage.getItem("token")}`
//   }
// });

// export default api;



