const assert = require('assert');
const {faker} = require('@faker-js/faker');
const sinon = require('sinon');
const {Operation, Payment, User} = require("../../db/postgres");
const operationService = require("../../services/operation");
const paymentService = require("../../services/payment");
const constants = require("../../helpers/constants");

describe('Unit - Operation service', function () {
    let user, payment;
    beforeEach(async function () {
        user = await User.findOne({where: {role: 'merchant'}});
        payment = await Payment.create({
            total: faker.finance.amount(),
            currency: constants.CURRENCIES[Math.floor(Math.random() * constants.CURRENCIES.length)],
            client_field: faker.number.int().toString(), // as we can also pass string
            order_field: faker.number.int().toString(),
            UserId: user.id,
        })

        // prevent console.log
        sinon.stub(console, 'log');
        sinon.stub(console, 'error');
    });

    afterEach(function () {
        sinon.restore();
        payment.destroy();
    });

    describe('#findOneBy()', function () {
        it('should return operation', async function () {
            const expectedOperation = (await Operation.findOne({where: {}})); // findOne need criteria
            const operation = await operationService.findOneBy({id: expectedOperation.id});
            assert.strictEqual(operation.id, expectedOperation.id);
        });

        it('should return null if not found', async function () {
            const operation = await operationService.findOneBy({id: 0});
            assert.strictEqual(operation, null);
        });

        it('should return only one when many found', async function () {
            const operation = await operationService.findOneBy({});
            assert.strictEqual(operation instanceof Operation, true);
        });
    });

    describe('#create()', function () {
        it('should create capture operation', async function () {
            const data = getOperationData(payment);
            const operation = await operationService.create(data);
            assert.strictEqual(operation instanceof Operation, true);
            for (const key in data) {
                if (key === 'amount') {
                    assert.strictEqual(operation.amount, data.amount.toFixed(2));
                } else {
                    assert.strictEqual(operation[key], data[key]);
                }
            }
        });

        it('should create refund operation', async function () {
            const data = {
                amount: faker.number.float(),
                type: 'refund',
                PaymentId: payment.id,
            };
            const operation = await operationService.create(data);
            assert.strictEqual(operation instanceof Operation, true);
            for (const key in data) {
                if (key === 'amount') {
                    assert.strictEqual(operation.amount, data.amount.toFixed(2));
                } else {
                    assert.strictEqual(operation[key], data[key]);
                }
            }
        });

        it('should throw error if no amount', async function () {
            const data = getOperationData(payment);
            delete data.amount;
            await assert.rejects(async () => {
                await operationService.create(data);
            });
        });
    });

    describe('#update()', function () {
        it('should update operation', async function () {
            this.timeout(6 * 1000);
            const data = getOperationData(payment);
            const operation = await Operation.create(data);
            const newAmount = faker.number.float();
            const [updatedOperation] = await operationService.update({id: operation.id}, {amount: newAmount});
            assert.strictEqual(updatedOperation.amount, newAmount.toFixed(2));
        });

        it('should return undefined if operation not found', async function () {
            const newAmount = faker.number.float();
            const [result] = await operationService.update({id: 0}, {amount: newAmount});
            assert.strictEqual(result, undefined);
        });
    });

    describe('#format()', function () {
        it('should return formatted operation', async function () {
            const operation = await Operation.findOne({where: {}});
            const formattedOperation = operationService.format(operation);
            const keysReturned = Object.keys(formattedOperation);
            for (const key in formattedOperation) {
                // check there is no keys that shouldn't be returned
                assert.strictEqual(keysInFormattedOperation.includes(key), true);
            }
            for (const key of keysInFormattedOperation) {
                // check all needed keys are be returned
                assert.strictEqual(keysReturned.includes(key), true);
            }
        });

        it('should return formatted multiple operations', async function () {
            const operations = await Operation.findAll({limit: 4});
            const formattedOperations = paymentService.format(operations);
            assert.strictEqual(formattedOperations instanceof Array, true);
            for (const operation of formattedOperations) {
                const keysReturned = Object.keys(operation);
                for (const key in operation) {
                    // check there is no keys that shouldn't be returned
                    assert.strictEqual(keysInFormattedOperation.includes(key), true);
                }
                for (const key of keysInFormattedOperation) {
                    // check all needed keys are be returned
                    assert.strictEqual(keysReturned.includes(key), true);
                }
            }
        });
    });
});

const getOperationData = (payment) => {
    return {
        amount: faker.number.float(),
        last4: faker.finance.creditCardNumber().slice(-4),
        type: 'capture',
        PaymentId: payment.id,
    };
}

const keysInFormattedOperation = [
    'id',
    'uuid',
    'amount',
    'last4',
    'type',
    'createdAt',
    'updatedAt',
    'status',
    'PaymentId',
];