// lib/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://knitwear-backend.onrender.com"
      : "http://localhost:4000",
});

export default api;
