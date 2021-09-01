import.meta.hot;
const { API_URL } = __SNOWPACK_ENV__;
import authHeader from './auth-header.js';
import createInterceptor from './auth-interceptor.js';


class CardService {
    async create(intentId, cardDetails, useQuery, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.post(API_URL + "chatbot/intent/card", {
            intentId,
            cardDetails,
            useQuery
        }, {
            headers: authHeader(accessToken)
        });
        return response;
    }

    async update(intentId, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.put(API_URL + "chatbot/intent/card", {
            intentId
        }, {
            headers: authHeader(accessToken)
        });
        return response;
    }

    async delete(intentId, cardValues, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        console.log(intentId, cardValues)
        let response = await authInterceptor.delete(API_URL + "chatbot/intent/card", { headers: authHeader(accessToken), data: { intentId, cardValues } });
        return response;
    }

    async get(intentId, accessToken, setAccessToken) {
        try {
            let authInterceptor = createInterceptor(setAccessToken);
            let response = await authInterceptor.get(API_URL + "chatbot/intent/card", { headers: authHeader(accessToken), params: { intentId } });
            return response;
        } catch (err) {
            return response;
        }
    }
}

export default new CardService()