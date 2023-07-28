const paymentService = require('../services/payment');
const ValidationError = require('../errors/ValidationError');

const waitingTime = 10 * 1000;

module.exports = function () {
    return {
        capture: function (req, res, next) {
            try {
                // after 10 seconds, notify the payment has been captured
                const {
                    url = null,
                    method = null,
                    headers = null,
                    body = null,
                } = req.body;

                const errorsFields = {};
                if (!url || !url.trim()) {
                    errorsFields['url'] = ['url is required'];
                }
                if (!method || !method.trim() || !["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method)) {
                    errorsFields['method'] = ['method is required and must be one of GET, POST, PUT, PATCH, DELETE'];
                }

                if (Object.keys(errorsFields).length > 0) {
                    throw new ValidationError(errorsFields);
                }

                paymentService.capture(req.body);

                const fetchOptions = {
                    method,
                }
                if (headers) {
                    fetchOptions.headers = headers;
                }
                if (body) {
                    fetchOptions.body = body;
                }

                setTimeout(() => {
                    fetch(url, fetchOptions)
                }, waitingTime);

                res.sendStatus(202);
            } catch (err) {
                next(err);
            }
        },
        refund: function (req, res, next) {
            try {
                const {
                    url = null,
                    method = null,
                    headers = null,
                    body = null,
                } = req.body;

                const errorsFields = {};
                if (!url || !url.trim()) {
                    errorsFields['url'] = ['url is required'];
                }
                if (!method || !method.trim() || !["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method)) {
                    errorsFields['method'] = ['method is required and must be one of GET, POST, PUT, PATCH, DELETE'];
                }

                if (Object.keys(errorsFields).length > 0) {
                    throw new ValidationError(errorsFields);
                }

                paymentService.refund(req.body);

                const fetchOptions = {
                    method,
                }
                if (headers) {
                    fetchOptions.headers = headers;
                }
                if (body) {
                    fetchOptions.body = body;
                }

                setTimeout(() => {
                    fetch(url, fetchOptions)
                }, waitingTime);

                res.sendStatus(202);
            } catch (err) {
                next(err);
            }
        },
    }
};