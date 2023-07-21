const jwt = require("jsonwebtoken");
const userService = require("../services/user");

module.exports = (roles = null) => {
    if (roles && !Array.isArray(roles)) {
        roles = [roles]
    }

    return async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            if (!token) return res.sendStatus(401);

            const jwtData = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userService.findById(jwtData.id);
            if (!user) return res.sendStatus(401);
            req.user = user; // make sure that we have live data from the database

            if (req.user.role !== jwtData.role) return res.sendStatus(401); // role has changed since the token was created

            if (roles && !roles.includes(req.user.role)) return res.sendStatus(403); // role is not allowed

            next();
        } catch (error) {
            res.sendStatus(401);
        }
    };
};