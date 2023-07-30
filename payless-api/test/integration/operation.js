const assert = require('assert');
const jwt = require('jsonwebtoken');
const { Payment, Operation, connection} = require('../../db/postgres'); // Correct the path here
const request = require('supertest');
const app = require('../../index');
const sinon = require('sinon');
const uuid = require('uuid');

describe('Integration - /operations', function () {
    let token;
    let operationUUID;

    beforeEach(async function () {
        // prevent console.log
        sinon.stub(console, 'log');
        sinon.stub(console, 'error');

        operationUUID = (await Operation.findAll({limit: 1}))[0].uuid;

        const paymentInstance = new Payment();
        sinon.stub(paymentInstance, 'notify');

        token = jwt.sign({ operationId: operationUUID }, process.env.JWT_SECRET);
    });

    afterEach(function () {
        sinon.restore();
    });

    describe('POST /mark-as-done', function () {
        it('should update operation', async function () {
            this.timeout(6 * 1000)
            const response = await request(app)
                .post(`/operations/${operationUUID}/mark-as-done`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)

            assert.strictEqual(response.statusCode, 200);
            assert.strictEqual(response.body.status, 'succeeded');
        });

        it('should return 404 if not found', async function () {
            const invalidUUID = uuid.v4();
            const newToken = jwt.sign({ operationId: invalidUUID }, process.env.JWT_SECRET);
            const response = await request(app)
                .post(`/operations/${invalidUUID}/mark-as-done`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${newToken}`)

            assert.strictEqual(response.status, 404);
        });

        it('should return 401 if not authenticated', async function () {
            const response = await request(app)
                .post(`/operations/${operationUUID}/mark-as-done`)
                .set('Content-Type', 'application/json')

            assert.strictEqual(response.status, 401);
        });

        it('should return 401 if not right token', async function () {
            const incorrectToken = jwt.sign({ operationId: operationUUID }, 'incorrect_secret');

            const response = await request(app)
                .post(`/operations/${operationUUID}/mark-as-done`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${incorrectToken}`)


            assert.strictEqual(response.status, 401);
        });

        it('should return 403 if encoded data are wrong', async function () {
            const invalidToken = jwt.sign({ userId: 'invalid_user_id' }, process.env.JWT_SECRET);

            const response = await request(app)
                .post(`/operations/${operationUUID}/mark-as-done`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${invalidToken}`)

            assert.strictEqual(response.status, 403);
        });

    });
});
