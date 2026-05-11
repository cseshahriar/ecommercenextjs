/**
 * এই Axios API client টি স্বয়ংক্রিয়ভাবে token refresh handle করে।
 *
 * কাজ:
 * - API request পাঠায়
 * - Cookie সহ request পাঠায়
 * - Token expire হলে (401 error)
 *   refresh API call করে নতুন token আনে
 * - তারপর আগের request আবার পাঠায়
 *
 * সুবিধা:
 * - User বারবার login করতে হয় না
 * - Authentication system cleaner হয়
 * - সব API logic এক জায়গায় থাকে

 * User Login
        ↓
    Access Token expires
        ↓
    API returns 401
        ↓
    Interceptor catches error
        ↓
    Calls /refresh
        ↓
    New access token generated
        ↓
    Original request retried
        ↓
    User continues normally
* */

import axios from "axios";

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    withCredentials: true // allow cookies
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if(
            error.response?.status === 401 && 
            !originalRequest._retry &&
            !originalRequest.url.includes('refresh')
        ) {
            originalRequest._retry = true;
            try {
                await api.post("api/account/refresh");
                return api(originalRequest);
            } catch(refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;