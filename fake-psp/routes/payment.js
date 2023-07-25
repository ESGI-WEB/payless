const {Router} = require("express");
const paymentController = require("../controllers/payment")();

module.exports = () => {
    const router = new Router();


    router.post("/capture", paymentController.capture);

    // app.get("/refund", (req, res) => {
    //   res.send("pong");
    // });

    return router;
};