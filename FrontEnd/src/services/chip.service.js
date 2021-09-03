import.meta.hot;
const { API_URL } = __SNOWPACK_ENV__;
import authHeader from './auth-header.js';
import createInterceptor from './auth-interceptor.js';

class ChipService {
    async create(intentId, chipValue, useQuery, order, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.post(API_URL + "chatbot/intent/chip", {
            intentId,
            chipValue,
            useQuery,
            order
        }, {
            headers: authHeader(accessToken)
        });
        console.log(response)
        return response;
    }

    async update(intentId, chipValue, accessToken, setAccessToken, chips) {
        let authInterceptor = createInterceptor(setAccessToken);
        try {
            let response = await authInterceptor.put(API_URL + "chatbot/intent/chip", {
                intentId,
                chipValue,
                chips
            }, {
                headers: authHeader(accessToken)
            });
            return response;
        }
        catch (err) {
            console.log(err);
        }
    }

    async delete(intentId, chipValue, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.delete(API_URL + "chatbot/intent/chip", { headers: authHeader(accessToken), data: { intentId, chipValue } });
        return response;
    }

    async get(intentId, accessToken, setAccessToken) {
        try {
            let authInterceptor = createInterceptor(setAccessToken);
            let response = await authInterceptor.get(API_URL + "chatbot/intent/chip", { headers: authHeader(accessToken), params: { intentId } });
            return response;
        } catch (err) {
            return response;
        }
    }
}

export default new ChipService()