const assert = require('assert');
const {User} = require('../../db/postgres');
const constants = require('../../helpers/constants');
const {faker} = require('@faker-js/faker');
const request = require('supertest');
const app = require('../../index');
const mailerService = require("../../services/mailer");
const sinon = require('sinon');
const {Op} = require('sequelize');

describe('Integration - /users', function () {
    let admin, user, merchant = null;
    beforeEach(async function () {
        // mock sendRegistrationMail
        sinon.stub(mailerService, 'sendRegistrationMail');
        sinon.stub(mailerService, 'sendValidationMail')
        sinon.stub(mailerService, 'sendRefusedMail')
        sinon.stub(mailerService, 'sendEmail')
        // prevent console.log
        sinon.stub(console, 'log');
        sinon.stub(console, 'error');
        admin = await User.findOne({where: {role: 'admin'}});
        admin.token = admin.generateToken();
        user = await User.findOne({where: {role: {[Op.not]: 'admin'}}});
        user.token = user.generateToken();
        merchant = await User.findOne({where: {role: 'merchant'}});
        merchant.token = merchant.generateToken();
    });

    afterEach(function () {
        sinon.restore();
    });

    describe('GET /', function () {
        it('should return an array of users', async function () {
            // by default pagination is 10
            const response = await request(app)
                .get(`/users`)
                .set('Authorization', 'Bearer ' + admin.token);
            const expectedUsers = (await User.findAll({limit: 10})).map(user => user.format());

            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.body.data.length, 10);
            assert.deepStrictEqual(response.body.data, expectedUsers)
        });
        
        it('should return an array of users paginated', async function () {
            const response = await request(app)
                .get(`/users`)
                .query({_page: 2, _itemsPerPage: 5})
                .set('Authorization', 'Bearer ' + admin.token);
            const expectedUsers = (await User.findAll({limit: 5, offset: 5})).map(user => user.format());

            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.body.data.length, 5);
            assert.deepStrictEqual(response.body.data, expectedUsers)
        });
        
        it('should return an array of users filtered', async function () {
            const response = await request(app)
                .get(`/users`)
                .query({role: 'merchant-to-validate'})
                .set('Authorization', 'Bearer ' + admin.token);
            const expectedUsers = (await User.findAll({limit: 10, where: {role: 'merchant-to-validate'}})).map(user => user.format());

            assert.strictEqual(response.status, 200);
            assert.deepStrictEqual(response.body.data, expectedUsers)
        });
        
        it('should return an array of users sorted', async function () {
            const response = await request(app)
                .get(`/users`)
                .query({_sort: {email: 'DESC'}})
                .set('Authorization', 'Bearer ' + admin.token);
            const expectedUsers = (await User.findAll({limit: 10, order: [['email', 'DESC']]})).map(user => user.format());

            assert.strictEqual(response.status, 200);
            assert.deepStrictEqual(response.body.data, expectedUsers)
        });
        
        it('should throw error if not admin authenticated', async function () {
            await request(app)
                .get(`/users`)
                .set('Authorization', 'Bearer ' + user.token)
                .expect(403);
        });
    });

    describe('GET /me', function () {
        it('should return current user', async function () {
            const response = await request(app)
                .get(`/me`)
                .set('Authorization', 'Bearer ' + merchant.token);

            assert.strictEqual(response.status, 200);
            assert.deepStrictEqual(response.body, merchant.format())
        });

        it('should return current user admin authenticated', async function () {
            const response = await request(app)
                .get(`/me`)
                .set('Authorization', 'Bearer ' + admin.token);

            assert.strictEqual(response.status, 200);
            assert.deepStrictEqual(response.body, admin.format())
        });

        it('should throw error if not validated', async function () {
            const userToValidateToken = (await User.create(getUserData())).generateToken();
            const userRefusedToken = (await User.create({...getUserData(), role: 'refused'})).generateToken();

            for (const token of [userToValidateToken, userRefusedToken]) {
                const response = await request(app)
                    .get(`/me`)
                    .set('Authorization', 'Bearer ' + token);
                assert.strictEqual(response.status, 403);
            }
        });

        it('should throw error if not authenticated', async function () {
            await request(app)
                .get(`/me`)
                .expect(401);
        });
    });

    describe('POST /', function () {
        it('should create a user', async function () {
            const newData = getUserData();
            const response = await request(app)
                .post(`/users`)
                .set('Authorization', 'Bearer ' + admin.token)
                .send(newData);

            assert.strictEqual(response.status, 201);
            for (const key of Object.keys(newData)) {
                if (key === 'password') continue;
                assert.strictEqual(response.body[key], newData[key]);
            }
            assert.strictEqual(response.body.role, 'merchant-to-validate');
            assert.strictEqual(response.body.password, undefined); // password hash never returned
        });
        
        it('should create an admin', async function () {
            const newData = {
                email: (new Date()).getTime()+faker.number.int()+'admin@payless.com', // unique email especially for test:only
                password: 'Azerty1*',
                role: 'admin'
            };
            const response = await request(app)
                .post(`/users`)
                .set('Authorization', 'Bearer ' + admin.token)
                .send(newData);

            assert.strictEqual(response.status, 201);
            assert.strictEqual(response.body.role, 'admin');
            assert.strictEqual(response.body.email, newData.email);
            assert.strictEqual(response.body.password, undefined); // password hash never returned
        });
        
        it('should throw error if not valid data', async function () {
            const newData = getUserData();
            await request(app)
                .post(`/users`)
                .set('Authorization', 'Bearer ' + admin.token)
                .send({...newData, email: 'not-valid-email'})
                .expect(422);
            await request(app)
                .post(`/users`)
                .set('Authorization', 'Bearer ' + admin.token)
                .send({...newData, password: 'not-valid-pwd'})
                .expect(422);
            delete newData.merchant_url;
            await request(app)
                .post(`/users`)
                .set('Authorization', 'Bearer ' + admin.token)
                .send(newData)
                .expect(422);
        });

        it('should throw error if not admin authenticated', async function () {
            const newData = getUserData();
            await request(app)
                .post(`/users`)
                .set('Authorization', 'Bearer ' + user.token)
                .send(newData)
                .expect(403);
        });
    });

    describe('GET /:id', function () {
        it('should get one user', async function () {
            const response = await request(app)
                .get(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(200);
            assert.deepStrictEqual(response.body, user.format());
        });

        it('should return not found', async function () {
            await request(app)
                .get(`/users/0`)
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(404);
        });

        it('should throw error if not admin authenticated', async function () {
            await request(app)
                .get(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + user.token)
                .expect(403);
        });
    });

    describe('PUT /:id', function () {
        it('should update an existing user', async function () {
            const newData = getUserData();
            const response = await request(app)
                .put(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + admin.token)
                .send(newData)
                .expect(200);

            for (const key of Object.keys(newData)) {
                if (key === 'password') continue;
                assert.strictEqual(response.body[key], newData[key]);
            }
            assert.strictEqual(response.body.password, undefined); // password hash never returned
            assert.strictEqual(response.body.id, user.id);
        });

        it('should create user if not existing', async function () {
            const newData = getUserData();
            const id = await User.max('id') + 1;
            const response = await request(app)
                .put(`/users/${id}`)
                .set('Authorization', 'Bearer ' + admin.token)
                .send(newData)
                .expect(201);

            for (const key of Object.keys(newData)) {
                if (key === 'password') continue;
                assert.strictEqual(response.body[key], newData[key]);
            }
            assert.strictEqual(response.body.password, undefined); // password hash never returned
        });

        it('should throw error if not valid data', async function () {
            const newData = getUserData();
            await request(app)
                .put(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + admin.token)
                .send({...newData, email: 'not-valid-email'})
                .expect(422);
            await request(app)
                .put(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + admin.token)
                .send({...newData, password: 'not-valid-pwd'})
                .expect(422);
            delete newData.merchant_url;
            await request(app)
                .put(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + admin.token)
                .send(newData)
                .expect(422);
        });

        it('should throw error if not admin authenticated', async function () {
            const newData = getUserData();
            await request(app)
                .put(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + user.token)
                .send(newData)
                .expect(403);
        });
    });

    describe('PATCH /:id', function () {
        it('should update a user', async function () {
            const newData = {
                merchant_url: faker.internet.url(),
                currency: 'EUR'
            };
            const response = await request(app)
                .patch(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + admin.token)
                .send(newData)
                .expect(200);

            for (const key of Object.keys(newData)) {
                if (key === 'password') continue;
                assert.strictEqual(response.body[key], newData[key]);
            }
            assert.strictEqual(response.body.id, user.id);
        });

        it('should return not found', async function () {
            const newData = {
                merchant_url: faker.internet.url(),
                currency: 'EUR'
            };
            await request(app)
                .patch(`/users/0`)
                .set('Authorization', 'Bearer ' + admin.token)
                .send(newData)
                .expect(404);
        });

        it('should throw error if data not valid', async function () {
            const newData = {
                currency: 'NOT VALID CURRENCY'
            };
            await request(app)
                .patch(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + admin.token)
                .send(newData)
                .expect(422);

            delete newData.merchant_url;
            await request(app)
                .patch(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + admin.token)
                .send(newData)
                .expect(422);
        });

        it('should throw error if not admin authenticated', async function () {
            const newData = {
                merchant_url: faker.internet.url(),
                currency: 'EUR'
            };
            await request(app)
                .patch(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + user.token)
                .send(newData)
                .expect(403);
        });
    });

    describe('DELETE /:id', function () {
        it('should delete user', async function () {
            await request(app)
                .delete(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(204);
        });

        it('should return not found', async function () {
            await request(app)
                .delete(`/users/0`)
                .set('Authorization', 'Bearer ' + admin.token)
                .expect(404);
        });

        it('should throw error if not admin authenticated', async function () {
            await request(app)
                .delete(`/users/${user.id}`)
                .set('Authorization', 'Bearer ' + user.token)
                .expect(403);
        });
    });

    describe('POST /:id/validate', function () {
        it('should validate user', async function () {
            const userToValidate = await User.create(getUserData());
            await request(app)
                .post(`/users/${userToValidate.id}/validate`)
                .set('Authorization', 'Bearer ' + admin.token)
                .set('Content-Type', 'application/json')
                .expect(200);
            assert.strictEqual((await User.findByPk(userToValidate.id)).role, 'merchant');
        });

        it('should throw error if not user under validation', async function () {
            const validatedUser = await User.findOne({where: {role: 'merchant'}});
            await request(app)
                .post(`/users/${validatedUser.id}/validate`)
                .set('Authorization', 'Bearer ' + admin.token)
                .set('Content-Type', 'application/json')
                .expect(403);
        });

        it('should return not found', async function () {
            await request(app)
                .post(`/users/0/validate`)
                .set('Authorization', 'Bearer ' + admin.token)
                .set('Content-Type', 'application/json')
                .expect(404);
        });

        it('should throw error if not admin authenticated', async function () {
            const userToValidate = await User.create(getUserData());
            await request(app)
                .post(`/users/${userToValidate.id}/validate`)
                .set('Authorization', 'Bearer ' + user.token)
                .set('Content-Type', 'application/json')
                .expect(403);
        });
    });

    describe('POST /:id/refuse', function () {
        it('should refuse user', async function () {
            const userToRefuse = await User.create(getUserData());
            await request(app)
                .post(`/users/${userToRefuse.id}/refuse`)
                .set('Authorization', 'Bearer ' + admin.token)
                .set('Content-Type', 'application/json')
                .expect(200);
            assert.strictEqual((await User.findByPk(userToRefuse.id)).role, 'refused');
        });

        it('should throw error if not user under validation', async function () {
            const validatedUser = await User.findOne({where: {role: 'merchant'}});
            await request(app)
                .post(`/users/${validatedUser.id}/refuse`)
                .set('Authorization', 'Bearer ' + admin.token)
                .set('Content-Type', 'application/json')
                .expect(403);
        });

        it('should return not found', async function () {
            await request(app)
                .post(`/users/0/refuse`)
                .set('Authorization', 'Bearer ' + admin.token)
                .set('Content-Type', 'application/json')
                .expect(404);
        });

        it('should throw error if not admin authenticated', async function () {
            const userToRefuse = await User.create(getUserData());
            await request(app)
                .post(`/users/${userToRefuse.id}/refuse`)
                .set('Authorization', 'Bearer ' + user.token)
                .set('Content-Type', 'application/json')
                .expect(403);
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