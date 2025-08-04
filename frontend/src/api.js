import axios from "axios";

// Base URL for your backend (adjust port if needed)
const API = axios.create({
    baseURL: "http://localhost:8000"
});

export default API;
