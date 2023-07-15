const jwt = require("jsonwebtoken");

module.exports = (role = null) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            if (!token) return res.sendStatus(401);

            req.user = jwt.verify(token, process.env.JWT_SECRET);

            if (role && req.user.role !== role) return res.sendStatus(403);

            next();
        } catch (error) {
            res.sendStatus(401);
        }
    };
};