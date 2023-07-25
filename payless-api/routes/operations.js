const {Router} = require("express");
const OperationController = require("../controllers/operations")();

module.exports = () => {
    const router = new Router();

    router.post("/:uuid/mark-as-done", OperationController.markAsDone);

    return router;
};