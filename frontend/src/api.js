import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// Request interceptor — token qo'shish
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — token muddati tugasa refresh qilish
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            try {
                const refresh = localStorage.getItem("refresh_token");
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/token/refresh/`,
                    { refresh }
                );
                localStorage.setItem("access_token", res.data.access);
                original.headers.Authorization = `Bearer ${res.data.access}`;
                return api(original);  // so'rovni qayta yuborish
            } catch (e) {
                // refresh ham o'tsa — login ga yo'naltirish
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;