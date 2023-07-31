const assert = require('assert');
const {User} = require('../../db/postgres');
const {faker} = require('@faker-js/faker');
const request = require('supertest');
const app = require('../../index');
const mailerService = require("../../services/mailer");
const sinon = require('sinon');
const constants = require("../../helpers/constants");
const {join} = require("path");

describe('Integration - security', function () {
    beforeEach(async function () {
        // prevent console.log
        sinon.stub(console, 'log');
        sinon.stub(console, 'error');
        sinon.stub(mailerService, 'sendRegistrationMail');
        sinon.stub(mailerService, 'sendValidationMail')
        sinon.stub(mailerService, 'sendRefusedMail')
        sinon.stub(mailerService, 'sendEmail')


    });

    afterEach(function () {
        sinon.restore();
    });

    describe('POST /register', function () {
        it('should register a new user', async function () {
            const userData = getUserData();
            const filePath = join(__dirname, 'test.pdf');


            await request(app)
                .post('/register')
                .attach('kbis', filePath)
                .field('company_name', userData.company_name)
                .field('zip_code', userData.zip_code)
                .field('city', userData.city)
                .field('address', userData.address)
                .field('country', userData.country)
                .field('merchant_url', userData.merchant_url)
                .field('confirmation_url', userData.confirmation_url)
                .field('cancel_url', userData.cancel_url)
                .field('webhook_url', userData.webhook_url)
                .field('currency', userData.currency)
                .field('email', userData.email)
                .field('password', userData.password)
                .expect(200)
                .then(response => {
                    assert.strictEqual(response.body.company_name, userData.company_name);
                    assert.strictEqual(response.body.email, userData.email);
                    assert(response.body.token);
                });
        });



    it('should return error when kbis is missing', async function () {
            const fakeUser = {
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: 'merchant-to-validate',
            };

            await request(app)
                .post('/register')
                .field('email', fakeUser.email)
                .field('password', fakeUser.password)
                .expect(422);
        });

    });



    describe('POST /login', function () {
        it('should login with valid credentials', async function () {
            const fakeUser = {
                email: faker.internet.email(),
                password: faker.internet.password(),
            };

            await User.create({
                email: fakeUser.email,
                password: 'Azerty1*',
            });

            await request(app)
                .post('/login')
                .send({
                    email: fakeUser.email,
                    password: 'Azerty1*',
                })
                .expect(200)
                .then(response => {
                    assert(response.body.token);
                });
        });

        it('should return error for invalid email', async function () {
            const fakeUser = {
                email: faker.internet.email(),
                password: faker.internet.password(),
            };

            await request(app)
                .post('/login')
                .send({
                    email: fakeUser.email,
                    password: fakeUser.password,
                })
                .expect(401);
        });

        describe('POST /login', function () {
            it('should return error for invalid password', async function () {
                const validPassword = getUserData().password;

                const user = await User.create({
                    email: faker.internet.email(),
                    password: validPassword,
                });

                const fakeUser = {
                    email: user.email,
                    password: 'InvalidPassword',
                };

                await request(app)
                    .post('/login')
                    .send({
                        email: fakeUser.email,
                        password: fakeUser.password,
                    })
                    .expect(401);
            });
        });
    });


});

const getUserData = () => {
    return {
        company_name: faker.company.name(),
        zip_code: faker.location.zipCode(),
        city: faker.location.city(),
        address: faker.location.streetAddress(),
        country: faker.location.country(),
        merchant_url: faker.internet.url(),
        confirmation_url: faker.internet.url(),
        cancel_url: faker.internet.url(),
        webhook_url: faker.internet.url(),
        currency: constants.CURRENCIES[0],
        email: 'new-user' + faker.internet.email(),
        password: 'Azerty1*',
        kbis: 'test.pdf',
    }
}
