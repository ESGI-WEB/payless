const paymentService = require('../services/payment');
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
const loader = new TwingLoaderFilesystem('./views');
const twing = new TwingEnvironment(loader);
const {Operation, User} = require('../db/postgres');

module.exports = function () {
    return {
        post: async function (req, res, next) {
            try {
                const data = req.body;

                // TODO set UserID
                data.UserId = (await User.findOne({where: {role: 'merchant'}})).id; // TODO TO REMOVE

                const payment = await paymentService.create(data);

                res.status(200).json(paymentService.format(payment));
            } catch (e) {
                next(e);
            }
        },
        checkout: async function (req, res, next) {
            try {
                const payment = await paymentService.findOneBy({
                    uuid: req.params.uuid,
                });

                if (!payment) {
                    res.sendStatus(404);
                }

                // TODO Check credentials
                const user = await payment.getUser(); // TO REMOVE
                // TODO Cors

                if (payment.status !== 'pending') {
                    res.sendStatus(403);
                }

                twing.render('checkout.twig', {
                    cancel_url: `${process.env.APP_URL}/payments/${payment.uuid}/cancel`,
                    canceled_url: user.cancel_url,
                    validate_url: `${process.env.APP_URL}/payments/${payment.uuid}/validate`,
                    confirmation_url: user.confirmation_url,
                }).then((output) => {
                    res.end(output);
                });
            } catch (e) {
                next(e);
            }
        },
        validate: async function (req, res, next) {
            try {
                const payment = await paymentService.findOneBy({
                    uuid: req.params.uuid,
                }, {
                    include: Operation
                });

                if (!payment) {
                    res.sendStatus(404);
                }

                // TODO Check credentials
                // TODO Cors

                if (payment.status !== 'pending') {
                    res.sendStatus(403);
                }

                await paymentService.validate(payment.uuid, req.body);

                res.sendStatus(200);
            } catch (e) {
                next(e);
            }
        },
        cancel: async function (req, res, next) {
            try {
                const payment = await paymentService.findOneBy({
                    uuid: req.params.uuid,
                }, {
                    include: Operation
                });

                if (!payment) {
                    res.sendStatus(404);
                }
                if (payment.status !== 'pending') {
                    res.sendStatus(403);
                }
                const operations = await payment.getOperations();
                if (operations?.length && operations.some(operation => operation.status === 'succeeded' && operation.type === 'capture')) {
                    res.sendStatus(403);
                }

                // TODO Check credentials
                // TODO Cors

                const [paymentUpdated] = await paymentService.update({uuid: req.params.uuid}, {status: 'canceled'});

                res.status(200).json(paymentService.format(paymentUpdated));
            } catch (e) {
                next(e);
            }
        }
    };
};
