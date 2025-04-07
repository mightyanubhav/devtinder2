const jwt = require('jsonwebtoken');
const authenticate = (req, res, next) =>{
    const token = req.cookies.token;
   
    if (!token) return res.status(401).send('Unauthorized');
    try {
        const decoded = jwt.verify(token, 'secret-key');
        req.user = decoded; // attach user info
        next();
    } catch (err) {
        return res.status(403).send('Invalid token');
    }
}

module.exports = { authenticate }