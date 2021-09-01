import.meta.hot;
const { API_URL } = __SNOWPACK_ENV__;
import authHeader from './auth-header.js';
import createInterceptor from './auth-interceptor.js';


class MessageService {
    async create(intentId, messageType, message, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.post(API_URL + "chatbot/intent/message", {
            intentId,
            messageType,
            message
        }, { headers: authHeader(accessToken) })


        return response;
    }

    async update(intentId, messageType, message, previousMessage, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.put(API_URL + "chatbot/intent/message", {
            intentId,
            messageType,
            message,
            previousMessage,
        }, {
            headers: authHeader(accessToken)
        });
        return response;
    }

    async delete(intentId, messageType, message, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.delete(API_URL + "chatbot/intent/message", { headers: authHeader(accessToken), data: { intentId, messageType, message } });
        return response;
    }

    async get(intentId, accessToken, setAccessToken) {
        try {
            let authInterceptor = createInterceptor(setAccessToken);
            let response = await authInterceptor.get(API_URL + "chatbot/intent/message", { headers: authHeader(accessToken), params: { intentId } });

            return response;
        } catch (err) {
            return err;
        }
    }
}

export default new MessageService();