// fill your database with test data, on every running tests, your db will be filled with these data
const {faker} = require('@faker-js/faker');
const {User} = require('./db');
const constants = require("./helpers/constants");

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

        const userUsedForMerchantDev = await User.create({
            company_name: faker.company.name(),
            zip_code: faker.location.zipCode(),
            city: faker.location.city(),
            address: faker.location.streetAddress(),
            country: faker.location.country(),
            merchant_url: process.env.TEST_MERCHANT_URL,
            confirmation_url: process.env.TEST_MERCHANT_URL + '/order/confirmed',
            cancel_url: process.env.TEST_MERCHANT_URL + '/order/cancelled',
            webhook_url: process.env.TEST_MERCHANT_BACK + '/payless',
            currency: currencies[Math.floor(Math.random() * currencies.length)],
            email: 'test@test.test',
            password: 'Azerty1*',
            kbis: 'test.pdf',
            role: 'merchant',
        });

        await userUsedForMerchantDev.update({
            secret_token: '3tCuWEVR7RyptMBBbBNn2gc7gAv12gGxuaIgF0PtgP3p823KG7',
            client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTA0NTk2MTJ9.DjBsIAe5SpW8-6MRiXUNew-DUhQnf06AXj06jL1m1kI'
        });

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
                webhook_url: faker.internet.url(),
                currency: currencies[Math.floor(Math.random() * currencies.length)],
                email: i+faker.internet.email(),
                password: 'Azerty1*',
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

        for (const user of users) {
            await User.create(user);
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seed().then(() => {
    console.log('Database seeded');
    process.exit(0);
});