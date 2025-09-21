import axios from "axios";
import auth from "@react-native-firebase/auth";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1", // Update to your backend URL
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await auth().currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
