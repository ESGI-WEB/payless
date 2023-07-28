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

                await paymentService.update({id: operation.PaymentId}, {status: 'succeeded'});

                if (operation.type === 'capture') {
                    await payment.notify('succeeded');
                }

                if (operation.type === 'refund') {
                    const refundOperations = await payment.getOperations({where: {type: 'refund'}});
                    const refundAmount = refundOperations.reduce((acc, operation) => acc + operation.amount, 0);
                    if (refundAmount >= payment.amount) { // greater is not possible, but just in case of
                        await payment.notify('refunded');
                        // maybe add a refund status to payment ?
                    }
                }


                res.json(operationService.format(operation));
            } catch (e) {
                next(e);
            }
        }
    };
};
