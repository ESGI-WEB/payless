const {Router} = require("express");
const PaymentController = require("../controllers/payments")();
const auth = require("../middlewares/auth");
const checkoutAuth = require("../middlewares/checkout");

module.exports = () => {
    const router = new Router();

    router.post("/", auth('merchant', true), PaymentController.post);
    router.get("/:uuid/checkout", checkoutAuth(), PaymentController.checkout);
    router.post("/:uuid/cancel", auth('merchant', true), PaymentController.cancel);
    router.post("/:uuid/validate", auth('merchant', true), PaymentController.validate);

    return router;
};