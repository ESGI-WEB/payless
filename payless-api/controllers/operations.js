const operationService = require('../services/operation');
const paymentService = require('../services/payment');

module.exports = function () {
    return {
        markAsDone: async function (req, res, next) {
            try {
                console.log('markAsDone', req.params.uuid)
                const [operation] = await operationService.update({
                    uuid: req.params.uuid,
                }, {status: 'succeeded'});

                if (!operation) {
                    return res.sendStatus(404);
                }

                if (operation.type === 'capture') {
                    await paymentService.update({id: operation.PaymentId}, {status: 'succeeded'});
                }

                res.json(operationService.format(operation));
            } catch (e) {
                next(e);
            }
        }
    };
};
