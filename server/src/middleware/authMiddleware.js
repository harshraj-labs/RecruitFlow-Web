const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    try {
        // Step 1: Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'No token provided, access denied' 
            });
        }

        // Step 2: Extract token (remove "Bearer " prefix)
        const token = authHeader.split(' ')[1];

        // Step 3: Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Step 4: Attach user id to request
        req.userId = decoded.userId;

        // Step 5: Continue to next middleware/route
        next();

    } catch (error) {
        res.status(401).json({ 
            error: 'Invalid token, access denied' 
        });
    }
};

module.exports = { protect };