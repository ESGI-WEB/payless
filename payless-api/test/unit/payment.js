const constants = require('../../helpers/constants');
const assert = require('assert');
const {faker} = require('@faker-js/faker');
const {Op} = require("sequelize");
const sinon = require('sinon');
const {Payment, User, connection} = require("../../db/postgres");
const paymentService = require("../../services/payment");
const userService = require("../../services/user");

describe('Unit - Payment service', function () {
    let randomUser, transaction;
    beforeEach(async function () {
        transaction = await connection.transaction();
        randomUser = await User.findOne({where: {role: 'merchant'}});
    });

    afterEach(function () {
        transaction.rollback();
        sinon.restore();
    });

    describe('#findOneBy()', function () {
        it('should return payment', async function () {
            const expectedPayment = (await Payment.findOne({where: {}})); // findOne need criteria
            const payment = await paymentService.findOneBy({id: expectedPayment.id});
            assert.strictEqual(payment.id, expectedPayment.id);
        });

        it('should return null if not found', async function () {
            const payment = await paymentService.findOneBy({id: 0});
            assert.strictEqual(payment, null);
        });

        it('should return only one when many found', async function () {
            const payment = await paymentService.findOneBy({});
            assert.strictEqual(payment instanceof Payment, true);
        });
    });

    describe('#create()', function () {
        it('should create with all fields', async function () {
            const data = getPaymentData(randomUser);
            const payment = await paymentService.create(data);

            assert.strictEqual(payment instanceof Payment, true);
            for (const key in data) {
                assert.strictEqual(payment[key], data[key]);
            }
        });

        it('should create with only required fields', async function () {
            const data = getPaymentData(randomUser);
            for (const field in data) {
                if (!requiredFields.includes(field)) {
                    delete data[field];
                }
            }
            const payment = await paymentService.create(data);
            assert.strictEqual(payment instanceof Payment, true);
            for (const key in requiredFields) {
                assert.strictEqual(payment[key], data[key]);
            }
        });

        it('should throw error if missing fields', async function () {
            const data = getPaymentData(randomUser);
            for (const field of requiredFields) {
                if (field === 'UserId') return; // we can create payment without user for history
                const dataWithMissingField = {...data};
                delete dataWithMissingField[field];
                await assert.rejects(async () => {
                    await paymentService.create(dataWithMissingField);
                });
            }
        });
    });

    describe('#update()', function () {
        it('should update with all fields', async function () {
            const payment = await Payment.findOne({where: {}});
            const data = getPaymentData(randomUser);
            const [updatedPayment] = await paymentService.update({id: payment.id}, data);
            assert.strictEqual(updatedPayment instanceof Payment, true);
            for (const key in data) {
                assert.strictEqual(updatedPayment[key], data[key]);
            }
        });

        it('should update with only required fields', async function () {
            const payment = await Payment.findOne({where: {}});
            const data = getPaymentData(randomUser);
            for (const field in data) {
                if (!requiredFields.includes(field)) {
                    delete data[field];
                }
            }
            const [updatedPayment] = await paymentService.update({id: payment.id}, data);
            assert.strictEqual(updatedPayment instanceof Payment, true);
            for (const key in requiredFields) {
                assert.strictEqual(updatedPayment[key], data[key]);
            }
        });

        it('should return undefined if not found', async function () {
            const data = getPaymentData(randomUser);
            const [updatedPayment] = await paymentService.update({id: 0}, data);
            assert.strictEqual(updatedPayment, undefined);
        });
    });

    describe('#validate()', function () {


    });

    describe('#refund()', function () {

    });

    describe('#format()', function () {
        it('should return formatted payment', async function () {
            const payment = await Payment.findOne({where: {}});
            const formattedPayment = paymentService.format(payment);
            const keysReturned = Object.keys(formattedPayment);
            for (const key in formattedPayment) {
                // check there is no keys that shouldn't be returned
                assert.strictEqual(keysInFormattedPayment.includes(key), true);
            }
            for (const key of keysInFormattedPayment) {
                // check all needed keys are be returned
                assert.strictEqual(keysReturned.includes(key), true);
            }
        });

        it('should return formatted multiple payments', async function () {
            const payments = await Payment.findAll({limit: 4});
            const formattedPayments = paymentService.format(payments);
            assert.strictEqual(formattedPayments instanceof Array, true);
            for (const payment of formattedPayments) {
                const keysReturned = Object.keys(payment);
                for (const key in payment) {
                    // check there is no keys that shouldn't be returned
                    assert.strictEqual(keysInFormattedPayment.includes(key), true);
                }
                for (const key of keysInFormattedPayment) {
                    // check all needed keys are be returned
                    assert.strictEqual(keysReturned.includes(key), true);
                }
            }
        });
    });

    describe('#findAll()', function () {

    });

    describe('#getAmountAndNumberOfTransactions()', function () {

    });

    describe('#getMerchant()', function () {

    });

    describe('#getChartData()', function () {

    });
});


const getPaymentData = (user) => {
    return {
        total: faker.finance.amount(),
        currency: constants.CURRENCIES[Math.floor(Math.random() * constants.CURRENCIES.length)],
        client_field: faker.number.int().toString(), // as we can also pass string
        order_field: faker.number.int().toString(),
        UserId: user.id,
    }
}

const requiredFields = ['total', 'currency', 'UserId'];
const keysInFormattedPayment = [
    'id',
    'uuid',
    'total',
    'status',
    'currency',
    'client_field',
    'order_field',
    'UserId',
    'checkout_link',
    'createdAt',
    'updatedAt',
];
