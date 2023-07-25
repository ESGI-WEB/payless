const {Sequelize} = require("sequelize");
const {Payment, Operation, connection} = require("../db");
const ValidationError = require("../errors/ValidationError");
const ServiceError = require("../errors/ServiceError");

module.exports = {
    findOneBy: async function (criteria = {}, options = {}) {
        return await Payment.findOne({
            where: criteria,
            ...options,
        });
    },
    create: async function (data) {
        try {
            return await Payment.create(data);
        } catch (e) {
            if (e instanceof Sequelize.ValidationError) {
                throw ValidationError.createFromSequelizeValidationError(e);
            }
            throw e;
        }
    },
    update: async function (criteria, data) {
        try {
            const [, payments = []] = await Payment.update(data, {
                where: criteria,
                returning: true,
                individualHooks: true,
            });

            return payments;
        } catch (e) {
            if (e instanceof Sequelize.ValidationError) {
                throw ValidationError.createFromSequelizeValidationError(e);
            }
            throw e;
        }
    },
    validate: async function (uuid, data) {
        const transaction = await connection.transaction();
        try {
            const {
                card_number = null,
                cardholder_name = null,
                expiration_date = null,
                cvv = null,
            } = data;

            const errorsFields = {};
            errorsFields['card_number'] = ['card_number is required'];
            if (!card_number || !card_number.trim()) {
                errorsFields['card_number'] = ['card_number is required'];
            } else if (!card_number.replaceAll(' ', '').match(/^[0-9]{16}$/)) {
                errorsFields['card_number'] = ['card_number is invalid'];
            }

            if (!cardholder_name || !cardholder_name.trim()) {
                errorsFields['cardholder_name'] = ['cardholder_name is required'];
            }

            if (!expiration_date || !expiration_date.trim()) {
                errorsFields['expiration_date'] = ['expiration_date is required'];
            } else if (!expiration_date.match(/^[0-9]{2}\/[0-9]{4}$/)) {
                errorsFields['expiration_date'] = ['expiration_date is invalid'];
            } else {
                const [month, year] = expiration_date.split('/');
                const now = new Date();
                const currentDateFormatted = (now.getMonth() + 1).toString().padStart(2, '0') + '/' + now.getFullYear();
                if (new Date(year, parseInt(month) - 1) < now && expiration_date !== currentDateFormatted) {
                    errorsFields['expiration_date'] = ['expiration_date is passed'];
                }
            }

            if (!cvv || !cvv.trim()) {
                errorsFields['cvv'] = ['cvv is required'];
            } else if (!cvv.match(/^[0-9]{3}$/)) {
                errorsFields['cvv'] = ['cvv is invalid'];
            }

            if (Object.keys(errorsFields).length > 0) {
                throw new ValidationError(errorsFields);
            }

            const [, payments] = await Payment.update({status: 'processing'}, {
                where: {uuid},
                returning: true,
                individualHooks: true,
            });
            const payment = payments[0];
            const amount = payment.total;
            const currency = payment.currency;

            const operation = await Operation.create({
                amount,
                last4: card_number.slice(-4),
                type: 'capture',
                PaymentId: payment.id,
            });

            // TODO TO SECURE
            const pspQuery = await fetch(process.env.PSP_URL+'/payments/capture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    card_number,
                    cardholder_name,
                    expiration_date,
                    cvv,
                    amount,
                    currency,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    url: process.env.BASE_PSP_URL_NOTIFICATION+`/operations/${operation.uuid}/mark-as-done`,
                }),
            })

            if (pspQuery.status != 202) {
                if (pspQuery.status == 422) {
                    throw new ValidationError(await pspQuery.json())
                }
                throw new ServiceError('PSP error')
            }

            await Operation.update({status: 'pending'}, {
                where: {uuid: operation.uuid},
            });

            transaction.commit();
            return payment;
        } catch (e) {
            transaction.rollback();
            if (e instanceof Sequelize.ValidationError) {
                throw ValidationError.createFromSequelizeValidationError(e);
            }
            throw e;
        }
    },
    format: function (payments) {
        if (payments instanceof Payment) {
            return payments.format();
        }

        return payments.map(payment => payment.format());
    }
};
