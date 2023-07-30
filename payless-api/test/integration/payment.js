const assert = require('assert');
const userService = require('../../services/user');
const {User, Payment} = require('../../db/postgres');
const constants = require('../../helpers/constants');
const {faker} = require('@faker-js/faker');
const request = require('supertest');
const app = require('../../index');
const mailerService = require("../../services/mailer");
const sinon = require('sinon');
const {Op} = require('sequelize');

describe('Integration - /payments', function () {
    let admin, user, merchant, merchantToValidate, refusedMerchant = null;
    before(async function () {
        admin = await User.findOne({where: {role: 'admin'}});
        admin.token = admin.generateToken();
        user = await User.findOne({where: {role: {[Op.not]: 'admin'}}});
        user.token = user.generateToken();
        merchant = await User.findOne({where: {role: 'merchant'}});
        merchant.token = merchant.generateToken();
        merchantToValidate = await User.findOne({where: {role: 'merchant-to-validate'}});
        merchantToValidate.token = merchantToValidate.generateToken();
        refusedMerchant = await User.findOne({where: {role: 'refused'}});
        refusedMerchant.token = refusedMerchant.generateToken();
        // prevent console.log
        sinon.stub(console, 'log');
        sinon.stub(console, 'error');
    });

    after(function () {
        sinon.restore();
    });

    describe('POST /', function () {
        it('should return 201 and create a payment', async function () {
            const data = getPaymentData();
            const response = await request(app)
                .post(`/payments`)
                .send(data)
                .set('Authorization', 'Bearer ' + merchant.client_token)
                .set('merchant_id', merchant.id)
                .expect(201);
            for(const key in data) {
                assert.equal(response.body[key], data[key]);
            }
            assert.strictEqual(response.body.status, 'pending');
            assert.strictEqual(response.body.UserId, merchant.id);
            assert.strictEqual(typeof response.body.checkout_link === 'string', true);
        });
        it('should return error if the payment is invalid', async function () {
            const data = getPaymentData();
            delete data.total;
            await request(app)
                .post(`/payments`)
                .send(data)
                .set('Authorization', 'Bearer ' + merchant.client_token)
                .set('merchant_id', merchant.id)
                .expect(422);
        });
        it('should not be accessible for non validated users', async function () {
            const data = getPaymentData();
            delete data.total;
            await request(app)
                .post(`/payments`)
                .send(data)
                .set('Authorization', 'Bearer ' + merchantToValidate.client_token)
                .set('merchant_id', merchantToValidate.id)
                .expect(403);
            await request(app)
                .post(`/payments`)
                .send(data)
                .set('Authorization', 'Bearer ' + refusedMerchant.client_token)
                .set('merchant_id', refusedMerchant.id)
                .expect(403);
        });
        it('should not be accessible for non authenticated', async function () {
            const data = getPaymentData();
            delete data.total;
            await request(app)
                .post(`/payments`)
                .send(data)
                .expect(401);
        });
        it('should not be accessible for authenticated by backoffice token', async function () {
            const data = getPaymentData();
            await request(app)
                .post(`/payments`)
                .send(data)
                .set('Authorization', 'Bearer ' + merchant.token) // need to use client_token
                .set('merchant_id', merchant.id)
                .expect(401);
        });
        it('should be accessible for authenticated by token generated', async function () {
            const jwt = require('jsonwebtoken');
            const token = jwt.sign({}, merchant.secret_token);

            const data = getPaymentData();
            const response = await request(app)
                .post(`/payments`)
                .send(data)
                .set('Authorization', 'Bearer ' + token)
                .set('merchant_id', merchant.id)
                .expect(201);
            for(const key in data) {
                assert.equal(response.body[key], data[key]);
            }
            assert.strictEqual(response.body.status, 'pending');
            assert.strictEqual(response.body.UserId, merchant.id);
            assert.strictEqual(typeof response.body.checkout_link === 'string', true)
        });
    });

    describe('GET /:uuid/checkout', function () {
        it('should return 200 and return the checkout page', async function () {
            const payment = await Payment.create({...getPaymentData(), UserId: merchant.id});
            await request(app)
                .get(`/payments/${payment.uuid}/checkout`)
                .set('referer', merchant.merchant_url)
                .expect(200);
        });
        it('should return 404 if the payment does not exist', async function () {
            const uuid = faker.string.uuid();
            await request(app)
                .get(`/payments/${uuid}/checkout`)
                .set('referer', merchant.merchant_url)
                .expect(404);
        });
        it('should return 403 if wrong referer', async function () {
            const payment = await Payment.create({...getPaymentData(), UserId: merchant.id});
            await request(app)
                .get(`/payments/${payment.uuid}/checkout`)
                .set('referer', 'https://www.wrong-url.com')
                .expect(403);
        });
        it('should return 403 if the payment can not be checked out', async function () {
            const payment = await Payment.create({
                ...getPaymentData(),
                UserId: merchant.id,
                status: 'processing' // mean that payment already started
            });
            await request(app)
                .get(`/payments/${payment.uuid}/checkout`)
                .set('referer', merchant.merchant_url)
                .expect(403);
        });
    });

    describe('POST /:uuid/cancel', function () {
        it('should cancel a payment', async function () {
            this.timeout(5*1000);
            const payment = await Payment.create({...getPaymentData(), UserId: merchant.id});
            await request(app)
                .post(`/payments/${payment.uuid}/cancel`)
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + merchant.client_token)
                .set('merchant_id', merchant.id)
                .set('referer', merchant.merchant_url)
                .expect(200);
        });
        it('should cancel a payment by generated token by secret', async function () {
            this.timeout(5*1000);
            const jwt = require('jsonwebtoken');
            const token = jwt.sign({}, merchant.secret_token);
            const payment = await Payment.create({...getPaymentData(), UserId: merchant.id});
            await request(app)
                .post(`/payments/${payment.uuid}/cancel`)
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .set('merchant_id', merchant.id)
                .set('referer', merchant.merchant_url)
                .expect(200);
        });
        it('should return 403 if the payment is not pending', async function () {
            const payment = await Payment.create({...getPaymentData(), UserId: merchant.id, 'status': 'processing'});
            await request(app)
                .post(`/payments/${payment.uuid}/cancel`)
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + merchant.client_token)
                .set('merchant_id', merchant.id)
                .set('referer', merchant.merchant_url)
                .expect(403);
        });
        it('should return 404 if the payment does not exist', async function () {
            const uuid = faker.string.uuid();
            await request(app)
                .post(`/payments/${uuid}/cancel`)
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + merchant.client_token)
                .set('merchant_id', merchant.id)
                .set('referer', merchant.merchant_url)
                .expect(404);
        });
        it('should return 401 if wrong token', async function () {
            const payment = await Payment.create({...getPaymentData(), UserId: merchant.id});
            await request(app)
                .post(`/payments/${payment.uuid}/cancel`)
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + merchant.token)
                .set('merchant_id', merchant.id)
                .set('referer', merchant.merchant_url)
                .expect(401);
        });
        it('should return 403 if wrong id', async function () {
            const payment = await Payment.create({...getPaymentData(), UserId: merchant.id});
            await request(app)
                .post(`/payments/${payment.uuid}/cancel`)
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + merchant.client_token)
                .set('merchant_id', merchant.id + 1)
                .set('referer', merchant.merchant_url)
                .expect(403);
        });
        it('should return 403 if wrong referer', async function () {
            const payment = await Payment.create({...getPaymentData(), UserId: merchant.id});
            await request(app)
                .post(`/payments/${payment.uuid}/cancel`)
                .set('Content-Type', 'application/json')
                .set('Authorization', 'Bearer ' + merchant.client_token)
                .set('merchant_id', merchant.id)
                .set('referer', faker.internet.url())
                .expect(403);
        });
    });

    describe('GET /', function () {
        it('should return 200 and return all payments of current user', async function () {

        });
        it('should return 200 and return all payments for admin', async function () {

        });
        it('should not be accessible for non validated users', async function () {

        });
        it('should not be accessible for non authenticated', async function () {

        });
    });

    describe('GET /get-amount-and-number-of-transactions', function () {

    });

    describe('GET /get-merchant', function () {

    });

    describe('GET /get-chart-data', function () {

    });
});

const getPaymentData = () => {
    return {
        total: faker.finance.amount(),
        currency: constants.CURRENCIES[Math.floor(Math.random() * constants.CURRENCIES.length)],
        client_field: faker.number.int().toString(), // as we can also pass string
        order_field: faker.number.int().toString(),
    }
}