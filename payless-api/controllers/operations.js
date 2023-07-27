const operationService = require('../services/operation');
const paymentService = require('../services/payment');

module.exports = function () {
    return {
        markAsDone: async function (req, res, next) {
            try {
                const [operation] = await operationService.update({
                    uuid: req.params.uuid,
                }, {status: 'succeeded'});

                if (!operation) {
                    return res.sendStatus(404);
                }

                const payment = await operation.getPayment();

                if (operation.type === 'capture') {
                    await paymentService.update({id: operation.PaymentId}, {status: 'succeeded'});
                }

                await payment.notify('succeeded');

                res.json(operationService.format(operation));
            } catch (e) {
                next(e);
            }
        }
    };
};
