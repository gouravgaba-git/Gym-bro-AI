const rawUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = (
  rawUrl && rawUrl.trim() !== "" ? rawUrl : "https://gym-bro-ai.onrender.com"
).replace(/\/$/, "");
