const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const fetchUser = (req, resp, next) => {
    const token = req.header('auth-token');
    try {
        if (!token) {
            return resp.status(401).send({ error: "Please, authenticate using valid token" })
        }

        const data = jwt.verify(token, secretKey);
        req.user = data.user;
        next();
    }
    catch (error) {
        return resp.status(401).send({ error: "Please, authenticate using valid token" })
    }
}

module.exports = fetchUser;