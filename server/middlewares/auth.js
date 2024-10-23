const { verify } = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        console.log('Authorization Header:', authHeader);

        if (!authHeader) {
            console.log('Authorization header missing');
            return res.sendStatus(401);
        }

        const accessToken = authHeader.split(' ')[1];
        console.log('Access Token:', accessToken);

        if (!accessToken) {
            console.log('No access token provided');
            return res.sendStatus(401);
        }

        const payload = verify(accessToken, process.env.APP_SECRET);
        console.log('Payload:', payload);
        
        // Confirm that the payload contains the expected fields
        if (!payload || !payload.id) {
            console.log('Invalid token payload');
            return res.sendStatus(401);
        }

        req.user = payload;
        return next();
    }
    catch (err) {
        console.log('Token verification error:', err);
        return res.sendStatus(401);
    }
}

module.exports = { validateToken };
