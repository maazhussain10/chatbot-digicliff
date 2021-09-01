import.meta.hot;
const { API_URL } = __SNOWPACK_ENV__;
import authHeader from './auth-header.js';
import createInterceptor from './auth-interceptor.js';


class NLPService {
    async post(chatbotId, message, hasFollowUp, previousIntent, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.post(API_URL + "chatbot/intent/message", {
            chatbotId,
            message,
            hasFollowUp,
            previousIntent
        }, { headers: authHeader(accessToken) })

        return response;
    }
}

export default new NLPService();