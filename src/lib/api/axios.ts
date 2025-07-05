// lib/api/axios.ts
import axios from "axios";

export const url =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PRODUCTION_URL
    : process.env.NEXT_PUBLIC_LOCAL_URL;

console.log("API URL:", url);

const api = axios.create({
  baseURL: url,
});

export default api;
