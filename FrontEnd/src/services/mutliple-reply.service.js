import.meta.hot;
const { API_URL } = __SNOWPACK_ENV__;
import authHeader from './auth-header.js';
import createInterceptor from './auth-interceptor.js';


class MultipleReplyService {
    async update(multipleReply, intentId, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.put(API_URL + "chatbot/intent/multiple-reply", {
            multipleReply,
            intentId
        }, {
            headers: authHeader(accessToken)
        });
        return response;
    }

    async get(intentId, accessToken, setAccessToken) {
        try {
            let authInterceptor = createInterceptor(setAccessToken);
            let response = await authInterceptor.get(API_URL + "chatbot/intent/multiple-reply", { headers: authHeader(accessToken), params: { intentId } });
            return response;
        } catch (err) {
            return response;
        }
    }
}

export default new MultipleReplyService();