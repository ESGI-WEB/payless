const jwt = require("jsonwebtoken");
const userService = require("../services/user");
const paymentService = require("../services/payment");
const operationService = require("../services/operation");

module.exports = () => {
    return async (req, res, next) => {
        try {
            const paymentUuid = req.params.uuid;

            const payment = await paymentService.findOneBy({ uuid: paymentUuid });
            if (!payment) return res.sendStatus(404);
            if (payment.status !== 'pending') return res.sendStatus(403);

            const user = await userService.findById(payment.UserId);
            if (!user) return res.sendStatus(404);

            const origin = req.headers.referer;
            const authorizedUrl = user.merchant_url;
            if (!origin.startsWith(authorizedUrl)) return res.sendStatus(403); // origin is not allowed

            req.user = user; // make sure that we have live data from the database

            next();
        } catch (error) {
            res.sendStatus(401);
        }
    };
};