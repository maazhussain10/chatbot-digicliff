import.meta.hot;
const { API_URL } = __SNOWPACK_ENV__;
import authHeader from './auth-header.js';
import createInterceptor from './auth-interceptor.js';


class IntentService {
    async create({ intentName, description }, previousIntent, chatbotId, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.post(API_URL + "chatbot/intent", {
            chatbotId,
            intentName,
            description,
            previousIntent
        }, { headers: authHeader(accessToken) })


        return response;
    }

    async update({ intentName, description }, previousIntent, intentId, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.put(API_URL + "chatbot/intent", {
            intentId,
            intentName,
            description,
            previousIntent
        }, {
            headers: authHeader(accessToken)
        });
        return response;
    }

    async delete(intentId, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.delete(API_URL + "chatbot/intent", { headers: authHeader(accessToken), data: { intentId } });
        return response;
    }

    async get(chatbotId, accessToken, setAccessToken) {
        try {
            let authInterceptor = createInterceptor(setAccessToken);
            let response = await authInterceptor.get(API_URL + "chatbot/intent", { headers: authHeader(accessToken), params: { chatbotId } });
            console.log("Response:", response);
            return response;
        } catch (err) {
            return err;
        }
    }
}

export default new IntentService();