import.meta.hot;
const { API_URL } = __SNOWPACK_ENV__;
import authHeader from './auth-header.js';
import createInterceptor from './auth-interceptor.js';


class SettingsService {

    async post(chatbotId, theme, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.post(API_URL + "chatbot/settings", {
            chatbotId,
            theme
        }, {
            headers: authHeader(accessToken)
        });
        return response;
    }

    async get(chatbotId, accessToken, setAccessToken) {
        try {
            let authInterceptor = createInterceptor(setAccessToken);
            let response = await authInterceptor.get(API_URL + "chatbot/settings", { headers: authHeader(accessToken), params: { chatbotId } });
            return response;
        } catch (err) {
            return response;
        }
    }
}

export default new SettingsService();