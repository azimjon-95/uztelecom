import axios from "axios";

const api = axios.create({
  baseURL: 'https://api.uztelecom.dadabayev.uz/api',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem("token")}`
  }
});

export default api;



