import.meta.hot;
const { API_URL } = __SNOWPACK_ENV__;
import authHeader from './auth-header.js';
import createInterceptor from './auth-interceptor.js';


class ChatWindowService {
    async post(chatbotId, message, hasFollowUp, previousIntent, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.post(API_URL + "chat-window", {
            chatbotId,
            message,
            hasFollowUp,
            previousIntent
        }, { headers: authHeader(accessToken) })

        return response;
    }

    async get(chatbotId, accessToken, setAccessToken) {
        try {
            let authInterceptor = createInterceptor(setAccessToken);
            let response = await authInterceptor.get(API_URL + "chat-window", { headers: authHeader(accessToken), params: { chatbotId } });
            return response;
        } catch (err) {
            return err;
        }
    }
}

export default new ChatWindowService();