import.meta.hot;
const { API_URL } = __SNOWPACK_ENV__;

import axios from 'axios';
import authHeader from './auth-header.js';
import createInterceptor from './auth-interceptor.js';


class AuthService {
    async login({ username, password }, setAccessToken) {

        let response = await axios.post(API_URL + "auth/login", {
            username,
            password
        })
        if (response.data.accessToken) {
            setAccessToken(response.data.accessToken);
        }

        return response;
    }

    async logout() {
        let response = await axios.put(API_URL + "auth/logout");
        return response;
    }

    async signup({ firstName, lastName, email, username, password }) {
        let response = await axios.post(API_URL + "auth/signup", {
            firstName,
            lastName,
            username,
            email,
            password
        });
        return response;
    }

    async getNewAccessToken() {
        try {
            let response = await axios.get(API_URL + "refresh-token");
            return response;
        } catch (err) {
            return err.response;
        }
    }

    async verifyAccessToken(accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        try {
            let response = await authInterceptor.get(API_URL + "auth/verify", { headers: authHeader(accessToken) });
            return response;
        }
        catch (err) {
            return err;
        }
    }
}

export default new AuthService();