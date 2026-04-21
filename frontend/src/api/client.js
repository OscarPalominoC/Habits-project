import axios from "axios";

const API_URL = "https://www.oscarpalomino.dev/habits/api/".replace(/\/$/, '')

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

export default api;
