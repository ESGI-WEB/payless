const {Router} = require("express");
const paymentController = require("../controllers/payment")();

module.exports = () => {
    const router = new Router();

    router.post("/capture", paymentController.capture);
    router.post("/refund", paymentController.refund);

    return router;
};