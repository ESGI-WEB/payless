const assert = require('assert');
const userService = require('../../services/user');
const {User, connection} = require('../../db/postgres');
const constants = require('../../helpers/constants');
const {faker} = require('@faker-js/faker');
const {Op} = require("sequelize");
const sinon = require('sinon');
const mailerService = require('../../services/mailer');

describe('Unit - User service', function () {
    let transaction;
    beforeEach(async function () {
        transaction = await connection.transaction()
        // mock sendRegistrationMail
        sinon.stub(mailerService, 'sendRegistrationMail')
        sinon.stub(mailerService, 'sendValidationMail')
        sinon.stub(mailerService, 'sendRefusedMail')
        sinon.stub(mailerService, 'sendEmail')
    });

    afterEach(function () {
        transaction.rollback();
        sinon.restore();
    });

    describe('#findAll()', function () {
        it('should return all users', async function () {
            const total = await User.count();
            const users = await userService.findAll();
            assert.strictEqual(users.length, total);
        });

        it('should return all user with merchant role', async function () {
            const total = await User.count({where: {role: 'merchant'}});
            const users = await userService.findAll({role: 'merchant'});
            assert.strictEqual(users.length, total);
        });

        it('should return all user with merchant role and order by email', async function () {
            const expectedOrder = await User.findAll({where: {role: 'merchant'}, order: [['email', 'DESC']]});
            const users = await userService.findAll({role: 'merchant'}, {order: {email: 'DESC'}});
            assert.strictEqual(users.length, expectedOrder.length);
            assert.deepStrictEqual(users, expectedOrder);
        });

        it('should return all user\'s first page', async function () {
            const users = await userService.findAll({}, {limit: 5, offset: 0});
            assert.strictEqual(users.length, 5);
        });
    });

    describe('#findById()', function () {
        it('should return user by id', async function () {
            const exepectedUser = (await User.findAll({limit: 1}))[0];
            const user = await userService.findById(exepectedUser.id);
            assert.strictEqual(user.id, exepectedUser.id);
        });

        it('should return null if user not found', async function () {
            const user = await userService.findById(0);
            assert.strictEqual(user, null);
        });
    });

    describe('#findOneBy()', function () {
        it('should return user with email', async function () {
            const expectedUser = (await User.findAll({limit: 1}))[0];
            const user = await userService.findOneBy({email: expectedUser.email});
            assert.strictEqual(user.email, expectedUser.email);
        });

        it('should return null if user not found', async function () {
            const user = await userService.findOneBy({email: 'not-existing@email.testing'});
            assert.strictEqual(user, null);
        });

        it('should return only one user when many found', async function () {
            const user = await userService.findOneBy({});
            assert.strictEqual(user instanceof User, true);
        });
    });

    describe('#create()', function () {
        it('should create a merchant-to-validate', async function () {
            const data = getUserData();

            const user = await userService.create(data);
            assert.strictEqual(user instanceof User, true);
            assert.strictEqual(user.role, 'merchant-to-validate');

            for (const key in data) {
                if (key === 'password') {
                    assert.notEqual(user.password, data.password);
                    continue;
                }
                assert.strictEqual(user[key], data[key]);
            }
            assert.strictEqual(user.createdAt.toDateString(), new Date().toDateString());
            assert.strictEqual(user.updatedAt.toDateString(), new Date().toDateString());
        });


        it('should create an admin', async function () {
            const data = {
                email: 'new-admin' + faker.internet.email(),
                password: 'Azerty1*',
                role: 'admin'
            };

            const user = await userService.create(data);

            assert.strictEqual(user instanceof User, true);
            assert.strictEqual(user.role, 'admin');
            assert.strictEqual(user.email, data.email);
            assert.notEqual(user.password, data.password);
            assert.strictEqual(user.createdAt.toDateString(), new Date().toDateString());
            assert.strictEqual(user.updatedAt.toDateString(), new Date().toDateString());
        });

        it('should throw an error if email already exists', async function () {
            const data = getUserData();
            data.email = (await User.findAll({limit: 1}))[0].email;
            await assert.rejects(async () => {
                await userService.create(data);
            });
        });

        it('should throw an error if email is not valid', async function () {
            const data = getUserData();
            data.email = 'not_valid@email';
            await assert.rejects(async () => {
                await userService.create(data);
            });
        });

        it('should throw an error if password is not valid', async function () {
            const data = getUserData();
            const notValidPasswords = [
                'passnotvalid',
                'passNotValid',
                'passnotvalid1',
                'Passnotvalid1',
                'passnotvalid*',
                'Passnotvalid*',
                'passnotvalid1*',
                'Pas1*',
            ];

            for (let password of notValidPasswords) {
                data.password = password;
                await assert.rejects(async () => {
                    await userService.create(data);
                });
            }
        });

        it('should throw errors if not all required fields for merchant-to-validate role', async function () {
            const data = getUserData();

            for (let field of merchantRequiredFields) {
                const dataCopy = {...data};
                // check if field empty in data
                dataCopy[field] = '';
                await assert.rejects(async () => {
                    await userService.create(dataCopy);
                });

                // check if field not in data
                delete dataCopy[field];
                await assert.rejects(async () => {
                    await userService.create(dataCopy);
                });
            }

        });

        it('should throw errors if not all required fields for admin role', async function () {
            const data = getUserData();
            data.role = 'admin';
            const requiredFields = [
                'email',
                'password',
            ];

            for (let field of requiredFields) {
                const dataCopy = {...data};
                delete dataCopy[field];
                await assert.rejects(async () => {
                    await userService.create(dataCopy);
                });
            }


        });
    });

    describe('#update()', function () {
        it('should update user', async function () {
            const userToUpdate = (await User.findAll({limit: 1}))[0];
            const newData = getUserData();
            const updatedUser = (await userService.update({id: userToUpdate.id}, newData))[0];

            assert.strictEqual(updatedUser instanceof User, true);
            for (const key in newData) {
                if (key === 'password') {
                    // check password changed
                    assert.notEqual(updatedUser.password, userToUpdate.password);
                    assert.notEqual(updatedUser.password, newData.password);
                    continue;
                }
                assert.strictEqual(updatedUser[key], newData[key]);
            }
            assert.strictEqual(updatedUser.id, userToUpdate.id);
        });

        it('should partially update user', async function () {
            const userToUpdate = (await User.findAll({limit: 1}))[0];
            const newData = {
                company_name: faker.company.name(),
                country: faker.location.country(),
                merchant_url: faker.internet.url(),
                currency: constants.CURRENCIES[1],
                password: 'Azerty1*'
            };
            const updatedUser = (await userService.update({id: userToUpdate.id}, newData))[0];

            assert.strictEqual(updatedUser instanceof User, true);
            assert.strictEqual(updatedUser.id, userToUpdate.id);
            for (const key in updatedUser.dataValues) {
                if (['updatedAt', 'createdAt'].includes(key)) continue;

                if (!(key in newData)) {
                    assert.strictEqual(updatedUser[key], userToUpdate[key]);
                    continue;
                }

                if (key === 'password') {
                    // check password changed
                    assert.notEqual(updatedUser.password, userToUpdate.password);
                    assert.notEqual(updatedUser.password, newData.password);
                    continue;
                }

                assert.strictEqual(updatedUser[key], newData[key]);
            }
        });


        it('should update an admin with not mandatory null values', async function () {
            const userToUpdate = (await User.findAll({where: {role: 'admin'}, limit: 1}))[0];
            const newData = getUserData();
            const mandatoryFields = ['email', 'password'];
            for (const key in newData) {
                if (!mandatoryFields.includes(key)) {
                    newData[key] = null;
                }
            }
            const updatedUser = (await userService.update({id: userToUpdate.id}, newData))[0];

            assert.strictEqual(updatedUser instanceof User, true);
            assert.strictEqual(updatedUser.id, userToUpdate.id);

            for (const key in updatedUser.dataValues) {
                if (key in newData && key !== 'password') { // password is hashed
                    assert.strictEqual(updatedUser[key], newData[key]);
                }
            }
        })

        it('should throw an error if email already exists', async function () {
            const [firstUser, secondUser] = await User.findAll({limit: 2});
            await assert.rejects(async () => {
                await userService.update({id: secondUser.id}, {email: firstUser.email});
            });
        });

        it('should throw an error if missing field updating admin', async function () {
            const userToUpdate = (await User.findAll({where: {role: 'admin'}, limit: 1}))[0];
            const newData = getUserData();
            const requiredFields = [
                'email',
                'password',
            ];

            for (const field of requiredFields) {
                const dataCopy = {...newData};
                dataCopy[field] = null; // try to set null to previous registered value
                await assert.rejects(async () => {
                    await userService.update({id: userToUpdate.id}, dataCopy);
                });
            }
        });

        it('should throw an error if missing field updating non admin', async function () {
            const userToUpdate = (await User.findAll({where: {role: 'merchant'}, limit: 1}))[0];
            const newData = getUserData();

            for (const field of merchantRequiredFields) {
                const dataCopy = {...newData};
                dataCopy[field] = null; // try to set null to previous registered value
                await assert.rejects(async () => {
                    await userService.update({id: userToUpdate.id}, dataCopy);
                });
            }
        });
    });

    describe('#remove()', function () {
        it('should delete user', async function () {
            const user = (await User.findAll({limit: 1, order: [['id', 'DESC']]}))[0];
            const nbDeleted = await userService.remove({id: user.id});

            assert.strictEqual(await userService.findById(user.id), null);
            assert.strictEqual(nbDeleted, 1);
        });

        it('should return 0 if not found', async function () {
            assert.strictEqual(await userService.remove({id: 0}), 0);
        });

        it('should delete many users', async function () {
            const toDelete = await User.findAll({limit: 3});
            const ids = toDelete.map(user => user.id);
            const deletedUsers = await userService.remove({id: {[Op.in]: ids}});

            assert.strictEqual(deletedUsers, toDelete.length);
        });
    });

    describe('#format()', function () {
        it('should return formatted user without password', async function () {
            const user = (await User.findAll({limit: 1}))[0];
            const formattedUser = userService.format(user);

            assert.strictEqual(formattedUser.password, undefined);
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

const merchantRequiredFields = [
    'company_name',
    'zip_code',
    'city',
    'address',
    'country',
    'merchant_url',
    'confirmation_url',
    'cancel_url',
    'webhook_url',
    'currency',
    'email',
    'password',
    'kbis',
];