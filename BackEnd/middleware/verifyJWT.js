const jwt = require("jsonwebtoken");
let { tokenConfig } = require('../configs');

let { ACCESS_TOKEN_SECRET } = tokenConfig;

let verifyToken = async (req, res, next) => {
    let token;
    /* 
       The Access Token is usually present in the authorization or x-access-token header. 
       It is prefixed with the word "Bearer". Therefore the header is split into an array and the Token is present in the 1st index.
   */

    let header = req.headers["authorization"] || req.headers["x-access-token"];
    if (header)
        token = header.split(' ')[1];
    else
        return res.status(401).send({ tryRefreshToken: true })

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        /* If the Token has expired, a response is sent back to client with a expired value set to true. The Request is intercepted and a request is 
        sent to the /token route, which returns a new access token if a verified refresh token is present and resends the original request.

        If refresh token is not present or does not match the signature, The user is told to login.
        */
        if (err && err.name === "TokenExpiredError")
            return res.status(401).send({ tryRefreshToken: true })

        /* If the error is due to invalid token or no token, The user is told to login */
        else if (err && err.name === "JsonWebTokenError")
            return res.status(401).send({ tryRefreshToken: false })
        // User id which is present in the access token is passed on in the original request.
        req.body.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;