const jwt = require("jsonwebtoken");
const userService = require("../services/user");
const paymentService = require("../services/payment");

module.exports = () => {
    return async (req, res, next) => {
        try {
            const operationUuid = req.params.uuid;
            const token = req.headers.authorization.split(" ")[1];
            if (!token) return res.sendStatus(401);

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded) return res.sendStatus(401);
            if (decoded.operationId !== operationUuid) return res.sendStatus(403);

            // TODO check url is psp

            console.log(req.headers);

            // const origin = req.headers.referer;
            // const authorizedUrl = user.merchant_url;
            // if (!origin.startsWith(authorizedUrl)) return res.sendStatus(403); // origin is not allowed

            next();
        } catch (error) {
            res.sendStatus(401);
        }
    };
};