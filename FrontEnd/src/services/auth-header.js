export default function authHeader(accessToken) {
    if (accessToken) {
        return { Authorization: 'Bearer ' + accessToken };
    } else {
        return {};
    }
}