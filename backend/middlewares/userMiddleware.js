const jwtSecretKey = "mithun1234";
const jwt = require('jsonwebtoken');

const userMiddleware = async (req, res, next) => {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const token = authToken.split(' ')[1]; // Extract token from 'Bearer <token>'
        const decoded = jwt.verify(token, jwtSecretKey);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = userMiddleware;
