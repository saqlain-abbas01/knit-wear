// lib/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://knitwear-backend.onrender.com",
});

export default api;
