// fill your database with test data, on every running tests, your db will be filled with these data
const {faker} = require('@faker-js/faker');
const {DataTypes} = require("sequelize");
const {User} = require('./db');
const constants = require("./helpers/constants");
const bcrypt = require("bcryptjs");

const seed = async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('No seeding in production');
        }

        /**** USERS ***/

        let i = 0;
        const users = [];
        const currencies = constants.CURRENCIES;
        const userRoles = ['merchant', 'merchant-to-validate', 'refused'];
        const salt = await bcrypt.genSalt(10);

        while (i < 20) {
            users.push({
                company_name: faker.company.name(),
                zip_code: faker.location.zipCode(),
                city: faker.location.city(),
                address: faker.location.streetAddress(),
                country: faker.location.country(),
                merchant_url: faker.internet.url(),
                confirmation_url: faker.internet.url(),
                cancel_url: faker.internet.url(),
                currency: currencies[Math.floor(Math.random() * currencies.length)],
                email: i+faker.internet.email(),
                password: await bcrypt.hash('Azerty1*', salt),
                kbis: 'test.pdf',
                role: userRoles[Math.floor(Math.random() * userRoles.length)],
            });
            i++;
        }
        // create admin user
        users.push({
            email: 'admin@payless.com',
            password: 'Azerty1*',
            role: 'admin'
        });

        await User.bulkCreate(users);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seed().then(() => {
    console.log('Database seeded');
    process.exit(0);
});