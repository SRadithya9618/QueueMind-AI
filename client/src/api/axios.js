import axios from "axios";

const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : "https://queuemind-ai.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});


// ADD TOKEN AUTOMATICALLY
API.interceptors.request.use(

  (req) => {

    const token = localStorage.getItem("token");

    if (token) {

      req.headers.Authorization =
        `Bearer ${token}`;

    }

    return req;
  }

);

export default API;
