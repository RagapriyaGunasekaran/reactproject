const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token = req.headers.authorization;
    
    if (token && token.startsWith('Bearer')) {
        try {
            // Extract token from "Bearer <token>"
            token = token.split(' ')[1];
            
            // Verify token using your JWT_SECRET from .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Add user data to the request object
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "No token, authorization denied" });
    }
};

module.exports = { protect };