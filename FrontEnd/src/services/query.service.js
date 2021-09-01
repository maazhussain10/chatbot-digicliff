import.meta.hot;
const { API_URL } = __SNOWPACK_ENV__;
import authHeader from './auth-header.js';
import createInterceptor from './auth-interceptor.js';


class QueryService {

    async getColumnNames(tableName, accessToken, setAccessToken) {
        try {
            let authInterceptor = createInterceptor(setAccessToken);
            let response = await authInterceptor.get(API_URL + "chatbot/query/column-names", { headers: authHeader(accessToken), params: { tableName } });
            return response;
        } catch (err) {
            return err;
        }
    }

    async createQuery(rows, selectedColumns, distinctColumn, tableName, intentId, accessToken, setAccessToken) {
        let authInterceptor = createInterceptor(setAccessToken);
        let response = await authInterceptor.post(API_URL + "chatbot/query/query-rows", {
            intentId,
            tableName,
            rows,
            selectedColumns,
            distinctColumn,
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
        let response = await authInterceptor.delete(API_URL + "chatbot/query/query-rows", { headers: authHeader(accessToken), data: { intentId } });
        return response;
    }

    async get(intentId, accessToken, setAccessToken) {
        try {
            let authInterceptor = createInterceptor(setAccessToken);
            let response = await authInterceptor.get(API_URL + "chatbot/query/query-rows", { headers: authHeader(accessToken), params: { intentId } });
            return response;
        } catch (err) {
            return err;
        }
    }
}

export default new QueryService();