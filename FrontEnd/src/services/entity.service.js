import.meta.hot;
const { API_URL } = __SNOWPACK_ENV__;
import authHeader from './auth-header.js';
import createInterceptor from './auth-interceptor.js';


class EntityService {
    async create(chatbotId, intentId, entities, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.post(API_URL + "chatbot/intent/entity", {
            chatbotId, intentId, entities
        }, { headers: authHeader(accessToken) })


        return response;
    }

    async get(intentId, accessToken, setAccessToken) {
        try {
            let authInterceptor = createInterceptor(setAccessToken);
            let response = await authInterceptor.get(API_URL + "chatbot/intent/entity", { headers: authHeader(accessToken), params: { intentId } });

            return response;
        } catch (err) {
            return err;
        }
    }
    
    async getEntityDetails(ipAddress, selectedChatbotId,type, accessToken, setAccessToken) {
        try {
            console.log(ipAddress);
            let authInterceptor = createInterceptor(setAccessToken);
            let response = await authInterceptor.get(API_URL + "chatbot/intent/visitor-entity", { headers: authHeader(accessToken), params: { ipAddress, selectedChatbotId,type } });
            return response;
        } catch (err) {
            return err;
        }
    }
}

export default new EntityService();