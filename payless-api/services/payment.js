const {Sequelize} = require("sequelize");
const {Payment, Operation, connection} = require("../db");
const ValidationError = require("../errors/ValidationError");
const constants = require("../helpers/constants");
const mailerService = require("./mailer");

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
    validate: async function (criteria, data) {
        const transaction = await connection.transaction();
        try {
            const {
                card_number = null,
                cardholder_name = null,
                expiration_date = null,
                cvv = null,
            } = data;

            const errorsFields = {};
            if (!card_number || !card_number.trim()) {
                errorsFields['card_number'] = 'card_number is required';
            } else if (!card_number.replaceAll(' ', '').match(/^[0-9]{16}$/)) {
                errorsFields['card_number'] = 'card_number is invalid';
            }

            if (!cardholder_name || !cardholder_name.trim()) {
                errorsFields['cardholder_name'] = 'cardholder_name is required';
            }

            if (!expiration_date || !expiration_date.trim()) {
                errorsFields['expiration_date'] = 'expiration_date is required';
            } else if (!expiration_date.match(/^[0-9]{2}\/[0-9]{4}$/)) {
                errorsFields['expiration_date'] = 'expiration_date is invalid';
            } else {
                const [month, year] = input.value.split('/');
                const now = new Date();
                const currentDateFormatted = (now.getMonth() + 1).toString().padStart(2, '0') + '/' + now.getFullYear();
                if (new Date(year, parseInt(month) - 1) < now && input.value !== currentDateFormatted) {
                    errorsFields['expiration_date'] = 'expiration_date is passed';
                }
            }

            if (!cvv || !cvv.trim()) {
                errorsFields['cvv'] = 'cvv is required';
            } else if (!cvv.match(/^[0-9]{3}$/)) {
                errorsFields['cvv'] = 'cvv is invalid';
            }

            if (Object.keys(errorsFields).length > 0) {
                throw new ValidationError(errorsFields);
            }

            // TODO call PSP

            const payment = (await Payment.update({
                status: 'processing',
            },{
                where: criteria,
                returning: true,
                individualHooks: true,
            }))[1][0];
            await Operation.create({
                amount: payment.total,
                last4: card_number.slice(-4),
                type: 'capture',
                status: 'pending',
                PaymentId: payment.id,
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
