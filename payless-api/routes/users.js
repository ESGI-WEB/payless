const auth = require("../middlewares/auth");
const GenericRouter = require("./genericCRUD");
const userController = require("../controllers/users")();

module.exports = () => {
    const router = new GenericRouter(userController);

    router.post("/:id/validate", auth('admin'), userController.validate);
    router.post("/:id/refuse", auth('admin'), userController.refused);

    return router;
};