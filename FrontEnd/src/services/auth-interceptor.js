import axios from "axios";
import authService from "./auth.service.js";


const createInterceptor = (setAccessToken) => {
    let authInterceptorInstance = axios.create();
    authInterceptorInstance.interceptors.response.use(undefined,
        async (err) => {
            const originalConfig = err.config;
            try {
                if (err.response && err.response.status === 401 && err.response.data.tryRefreshToken && !originalConfig._retry) {
                    originalConfig._retry = true;
                    let newAccessTokenResponse = await authService.getNewAccessToken();
                    if (newAccessTokenResponse.status === 200) {
                        let newAccessToken = newAccessTokenResponse.data.accessToken
                        originalConfig.headers.Authorization = "Bearer " + newAccessToken;
                        // Set Access Token
                        setAccessToken(newAccessToken);
                        return authInterceptorInstance(originalConfig);
                    } else {
                        return Promise.reject(newAccessTokenResponse);
                    }
                }
                return Promise.reject(err);
            } catch (err) {
                return Promise.reject(err);
            }
        }
    );
    return authInterceptorInstance;
}

export default createInterceptor;