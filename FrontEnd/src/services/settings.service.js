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
}

export default new SettingsService();