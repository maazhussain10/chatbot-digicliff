import.meta.hot;
const { API_URL } = __SNOWPACK_ENV__;
import authHeader from './auth-header.js';
import createInterceptor from './auth-interceptor.js';


class ProfileService {

    async update({ firstName, lastName }, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.put(API_URL + "user/profile", {
            firstName,
            lastName,
            description
        }, {
            headers: authHeader(accessToken)
        });
        return response;
    }

    async delete(accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.delete(API_URL + "user/profile", { headers: authHeader(accessToken) });
        return response;
    }

    async get(accessToken, setAccessToken) {
        try {
            let authInterceptor = createInterceptor(setAccessToken);
            let response = await authInterceptor.get(API_URL + "user/profile", { headers: authHeader(accessToken) });
            return response;
        } catch (err) {
            return response;
        }
    }
}

export default new ProfileService();