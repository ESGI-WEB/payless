const {Router} = require("express");
const PaymentController = require("../controllers/payments")();
const auth = require("../middlewares/auth");
const checkoutAuth = require("../middlewares/checkout");

module.exports = () => {
    const router = new Router();

    router.post("/", auth('merchant', true), PaymentController.post);
    router.get("/:uuid/checkout", checkoutAuth(), PaymentController.checkout);
    router.post("/:uuid/cancel", auth('merchant', true, true), PaymentController.cancel);
    router.post("/:uuid/validate", auth('merchant', true, true), PaymentController.validate);
    router.post("/:id/refund", auth('merchant'), PaymentController.refund);
    router.get('/', auth('merchant'), PaymentController.cget);
    router.get('/get-amount-and-number-of-transactions', auth('admin'), PaymentController.getAmountAndNumberOfTransactions)
    router.get('/get-merchant', auth('admin'), PaymentController.getMerchant)
    router.get('/get-chart-data', auth('admin'), PaymentController.getChartData)

    return router;
};