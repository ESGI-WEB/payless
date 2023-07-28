const GenericController = require("../controllers/genericCRUD");
const userService = require("../services/user");
const mailerService = require("../services/mailer");

module.exports = function () {
    return {
        ...(new GenericController(userService)),
        validate: async function (req, res, next) {
            try {
                const user = await userService.findById(parseInt(req.params.id));
                if (!user) return res.sendStatus(404);
                if (user.role !== 'merchant-to-validate') return res.sendStatus(403);
                await userService.update(
                    { id: parseInt(req.params.id) },
                    {
                        role: 'merchant'
                    }
                );

                await mailerService.sendValidationMail(user.email);
                res.sendStatus(200);
            } catch (e) {
                next(e)
            }
        },
        refused: async function (req, res, next) {
            try {
                const user = await userService.findById(parseInt(req.params.id));
                if (!user) return res.sendStatus(404);
                if (user.role !== 'merchant-to-validate') return res.sendStatus(403);

                await userService.update(
                    { id: parseInt(req.params.id) },
                    {
                        role: 'refused'
                    }
                );

                await mailerService.sendRefusedMail(user.email);
                res.sendStatus(200);
            } catch (e) {
                next(e)
            }
        },
        me: async function (req, res, next) {
            try {
                if (!req.user) return res.sendStatus(403);

                const user = await userService.findById(req.user.id);
                if (!user) return res.sendStatus(404);

                res.status(200).json(user.format());
            } catch (e) {
                next(e)
            }
        },
    };
};
