const assert = require('assert');
const userService = require('../../services/user');
const {User} = require('../../db/postgres');
const {faker} = require('@faker-js/faker');
const request = require('supertest');
const app = require('../../index');
const mailerService = require("../../services/mailer");
const sinon = require('sinon');
const {readFileSync} = require("fs");
const constants = require("../../helpers/constants");

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

            const stub = sinon.stub(userService, 'findOneBy').resolves(new User(fakeUser));
            const passwordStub = sinon.stub(User.prototype, 'checkPassword').resolves(true);

            await request(app)
                .post('/login')
                .send({
                    email: fakeUser.email,
                    password: fakeUser.password,
                })
                .expect(200)
                .then(response => { assert(response.body.token); });

            assert(stub.calledOnce);
            assert(passwordStub.calledOnce);
        });

        it('should return error for invalid email', async function () {
            const fakeUser = {
                email: faker.internet.email(),
                password: faker.internet.password(),
            };

            sinon.stub(userService, 'findOneBy').resolves(null);

            await request(app)
                .post('/login')
                .send({
                    email: fakeUser.email,
                    password: fakeUser.password,
                })
                .expect(401);
        });

        it('should return error for invalid password', async function () {
            const fakeUser = {
                email: faker.internet.email(),
                password: faker.internet.password(),
            };

            sinon.stub(userService, 'findOneBy').resolves(new User(fakeUser));
            sinon.stub(User.prototype, 'checkPassword').resolves(false);

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















