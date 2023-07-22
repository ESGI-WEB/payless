const {Router} = require("express");
const PaymentController = require("../controllers/payments")();

module.exports = () => {
    const router = new Router();

    router.post("/", PaymentController.post);
    router.get("/:uuid/checkout", PaymentController.checkout);
    router.post("/:uuid/cancel", PaymentController.cancel);
    router.post("/:uuid/validate", PaymentController.validate);

    return router;
};