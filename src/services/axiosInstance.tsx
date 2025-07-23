import axios from "axios";
import config from "../config/config.json";

const axiosInstance = axios.create({
    baseURL: config.coinGeckoBaseUrl,
    timeout: config.defaultTimeout,
    params: {
        x_cg_demo_api_key: process.env.REACT_APP_COINGECKO_API_KEY
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (config.headers) {
          config.headers.set("accept", "application/json");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            console.error("Error response:", error.response);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;