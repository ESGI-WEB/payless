const jwt = require("jsonwebtoken");
const userService = require("../services/user");

module.exports = (role = null) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            if (!token) return res.sendStatus(401);

            const jwtData = jwt.verify(token, process.env.JWT_SECRET);
            const user = userService.findById(jwtData.id);
            if (!user) return res.sendStatus(401);
            req.user = user; // make sure that we have live data from the database

            if (req.user.role !== jwtData.role) return res.sendStatus(401); // role has changed since the token was created

            if (role && req.user.role !== role) return res.sendStatus(403);

            next();
        } catch (error) {
            res.sendStatus(401);
        }
    };
};