const {Router} = require("express");
const OperationController = require("../controllers/operations")();
const pspAuth = require("../middlewares/pspAuth");

module.exports = () => {
    const router = new Router();

    router.post("/:uuid/mark-as-done", pspAuth(), OperationController.markAsDone);

    return router;
};