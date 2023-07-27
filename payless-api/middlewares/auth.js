const jwt = require("jsonwebtoken");
const userService = require("../services/user");

module.exports = (roles = null, verifyUsingUserSecret = false, checkReferer = false) => {
    if (roles && !Array.isArray(roles)) {
        roles = [roles]
    }

    return async (req, res, next) => {
        try {
            // check request origin is the same as merchant_url

            const token = req.headers.authorization.split(" ")[1];
            if (!token) return res.sendStatus(401);

            let jwtData, user;
            if (!verifyUsingUserSecret) {
                jwtData = jwt.verify(token, process.env.JWT_SECRET);
                user = await userService.findById(jwtData.id);
                if (!user) return res.sendStatus(401);

                if (user.role !== jwtData.role) return res.sendStatus(401); // role has changed since the token was created
            } else {
                const merchant_id = req.headers.merchant_id;
                if (!merchant_id) return res.sendStatus(401);

                user = await userService.findById(merchant_id);
                if (!user) return res.sendStatus(401);

                if (checkReferer) {
                    const origin = req.headers.referer;
                    const authorizedUrl = user.merchant_url;
                    if (!origin.startsWith(process.env.APP_URL) && !origin.startsWith(authorizedUrl)) return res.sendStatus(403);
                }

                jwt.verify(token, user.secret_token);
            }

            req.user = user; // make sure that we have live data from the database

            if (roles && !roles.includes(req.user.role)) return res.sendStatus(403); // role is not allowed

            next();
        } catch (error) {
            console.error(error);
            res.sendStatus(401);
        }
    };
};