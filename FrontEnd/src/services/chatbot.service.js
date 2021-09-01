import.meta.hot;
const { API_URL } = __SNOWPACK_ENV__;
import authHeader from './auth-header.js';
import createInterceptor from './auth-interceptor.js';


class ChatbotService {
    async create({ chatbotName, description }, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.post(API_URL + "chatbot", {
            chatbotName,
            description
        }, { headers: authHeader(accessToken) })


        return response;
    }

    async update({ chatbotName, description }, chatbotId, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.put(API_URL + "chatbot", {
            chatbotId,
            chatbotName,
            description
        }, {
            headers: authHeader(accessToken)
        });
        return response;
    }

    async delete(chatbotId, accessToken, setAccessToken) {
        console.log(chatbotId);
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.delete(API_URL + "chatbot", { headers: authHeader(accessToken), data: { chatbotId } });
        return response;
    }

    async get(chatbotId, accessToken, setAccessToken) {
        try {
            let authInterceptor = createInterceptor(setAccessToken);
            let response = await authInterceptor.get(API_URL + "chatbot", { headers: authHeader(accessToken), params: { chatbotId } });
            return response;
        } catch (err) {
            return err;
        }
    }

    async getSingleBot(chatbotId, accessToken, setAccessToken) {
        try {
            let authInterceptor = createInterceptor(setAccessToken);
            let response = await authInterceptor.get(API_URL + "chatbot", { headers: authHeader(accessToken), params: { chatbotId } });
            return response;
        } catch (err) {
            return err;
        }
    }
}

export default new ChatbotService();