const constants = require('../../helpers/constants');
const assert = require('assert');
const {faker} = require('@faker-js/faker');
const {Op} = require("sequelize");
const sinon = require('sinon');
const {Payment, User, connection, Operation} = require("../../db/postgres");
const paymentService = require("../../services/payment");
const userService = require("../../services/user");
const hooks = require("../../hooks/hooks");

describe('Unit - Payment service', function () {
    let randomUser, transaction;
    beforeEach(async function () {
        // prevent console.log
        sinon.stub(console, 'log');
        sinon.stub(console, 'error');
        sinon.stub(hooks, 'updateOperationOnPaymentDocument');
        sinon.stub(hooks, 'createOperationOnPaymentDocument');
        sinon.stub(hooks, 'updatePaymentDocument');
        sinon.stub(hooks, 'createPaymentDocument');
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

    describe('#validate()',  function () {
        const globalFetch = global.fetch;
        this.timeout(6 * 1000);

        beforeEach(function () {
            const fetchStub = sinon.stub();

            fetchStub.resolves({
                status: 202,
                json: sinon.stub().resolves({}),
            });
            global.fetch = fetchStub;
        });
        afterEach(function () {
            global.fetch = globalFetch;
        });

        it('should validate a payment (pass it in processing status with new operation)', async function () {
            const payment = await paymentService.create(getPaymentData(randomUser));
            const validatedPayment = await paymentService.validate(payment.uuid, {
                card_number: '1234123412341234',
                cardholder_name: 'John Doe',
                expiration_date: '12/'+(new Date().getFullYear()+1),
                cvv: '123',
            });
            const [operation] = await validatedPayment.getOperations();

            assert.strictEqual(validatedPayment instanceof Payment, true);
            assert.strictEqual(validatedPayment.status, 'processing');
            assert.strictEqual(operation instanceof Operation, true);
            assert.strictEqual(operation.type, 'capture');
            assert.strictEqual(operation.status, 'pending');
        });

        it('should return error if missing fields', async function () {
            const payment = await paymentService.create(getPaymentData(randomUser));
            const requiredData = {
                card_number: '1234123412341234',
                cardholder_name: 'John Doe',
                expiration_date: '12/'+(new Date().getFullYear()+1),
                cvv: '123',
            };
            for (const field in requiredData) {
                const dataWithMissingField = {...requiredData};
                delete dataWithMissingField[field];
                await assert.rejects(async () => {
                    await paymentService.validate(payment.uuid, dataWithMissingField);
                });
            }
        });

        it('should return error if invalid fields', async function () {
            const payment = await paymentService.create(getPaymentData(randomUser));
            const invalidData = {
                card_number: '1234123412341234',
                cardholder_name: 'John Doe',
                expiration_date: '12/'+(new Date().getFullYear()+1),
                cvv: '123',
            };
            for (const field in invalidData) {
                if (field === 'cardholder_name') continue;
                const dataWithInvalidField = {...invalidData};
                dataWithInvalidField[field] = 'invalid';
                await assert.rejects(async () => {
                    await paymentService.validate(payment.uuid, dataWithInvalidField);
                });
            }
        });
    });

    describe('#refund()', function () {
        this.timeout(6 * 1000);
        const globalFetch = global.fetch;
        let paymentToRefund, validatedOperation;
        beforeEach(async function () {
            const fetchStub = sinon.stub();

            fetchStub.resolves({
                status: 202,
                json: sinon.stub().resolves({}),
            });
            global.fetch = fetchStub;

            paymentToRefund = await Payment.create({...getPaymentData(randomUser), total: 100, status: 'succeeded'});
            validatedOperation = await paymentToRefund.createOperation({
                type: 'capture',
                amount: paymentToRefund.total,
                last4: faker.number.int({min: 1000, max: 9999}),
                status: 'succeeded',
            });
        });
        afterEach(async function () {
            global.fetch = globalFetch;
            await paymentToRefund.destroy();
            await validatedOperation.destroy();
        });

        it('should fully refund a payment', async function () {
            await paymentService.refund(paymentToRefund.id, {amount: paymentToRefund.total});
            const operations = await paymentToRefund.getOperations();
            const refundedOperation = operations.find(operation => operation.type === 'refund');

            assert.strictEqual(refundedOperation instanceof Operation, true);
            assert.strictEqual(refundedOperation.type, 'refund');
            assert.strictEqual(refundedOperation.status, 'pending');
            assert.strictEqual(refundedOperation.amount, paymentToRefund.total);
            assert.strictEqual(operations.length, 2);
        });
        it('should partially refund a payment', async function () {
            await paymentService.refund(paymentToRefund.id, {amount: 20});
            const operations = await paymentToRefund.getOperations();
            const refundedOperation = operations.find(operation => operation.type === 'refund');

            assert.strictEqual(paymentToRefund instanceof Payment, true);
            assert.strictEqual(refundedOperation instanceof Operation, true);
            assert.strictEqual(refundedOperation.type, 'refund');
            assert.strictEqual(refundedOperation.status, 'pending');
            assert.strictEqual(+refundedOperation.amount, 20);
            assert.strictEqual(operations.length, 2);
        });
        it('should return error if invalid amount', async function () {
            await assert.rejects(async () => {
                await paymentService.refund(paymentToRefund.id, {amount: -4});
            });

        });
        it('should return error if to high amount', async function () {
            await assert.rejects(async () => {
                await paymentService.refund(paymentToRefund.id, {amount: 400});
            });

        });
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
        it('should find all payments', async function () {
            this.timeout(6 * 1000)
            const payments = await paymentService.findAll();
            assert.strictEqual(payments instanceof Array, true);
            assert.strictEqual(payments.length > 0, true);
        });
    });

    describe('#getAmountAndNumberOfTransactions()', function () {
        it('should get amount and number of transactions for a given currency', async function () {
            const currency =  'EUR';
            const result = await paymentService.getAmountAndNumberOfTransactions(currency);
            assert.strictEqual(Array.isArray(result), true);
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].currency, currency);
            assert.strictEqual(typeof result[0].number_of_transactions, 'number');
            assert.strictEqual(typeof result[0].total_amount, 'number');
        });
    });

    describe('#getMerchant()', function () {
        it('should get number of merchants for admin', async function () {
            const adminUser = await User.findOne({ where: { role: 'admin' } });
            const result = await paymentService.getMerchant(adminUser);
            assert.strictEqual(Array.isArray(result), true);
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].number_of_merchants > 0, true);
        });

        it('should get number of customers for merchant', async function () {
            const merchantUser = await User.findOne({ where: { role: 'merchant' } });
            const result = await paymentService.getMerchant(merchantUser);
            assert.strictEqual(Array.isArray(result), true);
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].number_of_customers > 0, true);
        });

        it('should return an empty array for other roles', async function () {
            const merchantToValidateUser = await User.findOne({ where: { role: 'merchant-to-validate' } });
            const result = await paymentService.getMerchant(merchantToValidateUser);
            assert.strictEqual(Array.isArray(result), true);
            assert.strictEqual(result.length, 0);
        });
    });

    describe('#getChartData()', function () {
        it('should get chart data for a merchant', async function () {
            const merchantUser = await User.findOne({ where: { role: 'merchant' } });

            const criteria = { startDate: '2023-01-01', endDate: '2024-07-30', time: 'month' };

            const result = await paymentService.getChartData(criteria, merchantUser);

            assert.strictEqual(Array.isArray(result), true);
            assert.strictEqual(result.length > 0, true);

            for (const data of result) {
                assert.strictEqual(typeof data.date, 'string');
                assert.strictEqual(typeof data.total, 'number');
            }
        });

        it('should get chart data for an admin', async function () {
            const adminUser = await User.findOne({ where: { role: 'admin' } });

            const criteria = { startDate: '2023-01-01', endDate: '2024-07-30', time: 'month' };

            const result = await paymentService.getChartData(criteria, adminUser);

            assert.strictEqual(Array.isArray(result), true);
            assert.strictEqual(result.length > 0, true);

            for (const data of result) {
                assert.strictEqual(typeof data.date, 'string');
                assert.strictEqual(typeof data.total, 'number', );
            }
        });

        it('should return an empty array for other roles', async function () {
            const merchantToValidateUser = await User.findOne({ where: { role: 'merchant-to-validate' } });

            const criteria = { startDate: '2023-01-01', endDate: '2024-07-30', time: 'month' };

            const result = await paymentService.getChartData(criteria, merchantToValidateUser);

            assert.strictEqual(Array.isArray(result), true);
            assert.strictEqual(result.length, 0);
        });
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
