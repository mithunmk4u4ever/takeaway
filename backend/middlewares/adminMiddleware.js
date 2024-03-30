const myAdminKey="admin@123"
const jwt = require('jsonwebtoken');

const adminMiddleware = async (req, res, next) => {
    const adminToken = req.headers.authorization;

    if (!adminToken) {
        return res.status(401).json({ success: false, message: 'Authorized for Admin Only..!' });
    }

    try {
        const token = adminToken.split(' ')[1]; // Extract token from 'Bearer <token>'
        const decoded = jwt.verify(token, myAdminKey);
        req.admin = decoded.admin;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = adminMiddleware;
