const assert = require('assert');
const userService = require('../../services/user');
const {User} = require('../../db/postgres');
const constants = require('../../helpers/constants');
const {faker} = require('@faker-js/faker');
const request = require('supertest');
const app = require('../../index');
const mailerService = require("../../services/mailer");
const sinon = require('sinon');
const {Op} = require('sequelize');

describe('Integration - /payments', function () {
    beforeEach(async function () {

    });

    afterEach(function () {
        sinon.restore();
    });

    describe('POST /', function () {
        it('should return 201 and create a payment', async function () {

        });
        it('should return error if the payment is invalid', async function () {

        });
        it('should not be accessible for non validated users', async function () {

        });
        it('should not be accessible for non authenticated', async function () {

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

    describe('GET /:uuid/checkout', function () {
        it('should return 200 and return the checkout page', async function () {

        });
        it('should return 404 if the payment does not exist', async function () {

        });
        it('should return 401 if the user is not authenticated correctly', async function () {

        });
        it('should return 403 if the payment can not be checked out', async function () {

        });
    });

    describe('POST /:uuid/cancel', function () {
        it('should cancel a payment', function () {

        });
        it('should return 403 if the payment is not pending', async function () {

        });
        it('should return 404 if the payment does not exist', async function () {

        });
        it('should return 401 if the user is not authenticated correctly', async function () {

        });
    });

    describe('POST /:uuid/validate', function () {
        it('should validate a payment', function () {

        });
        it('should return 403 if the payment is not pending', async function () {

        });
        it('should return 404 if the payment does not exist', async function () {

        });
        it('should return 401 if the user is not authenticated correctly', async function () {

        });
    });

    describe('POST /:id/refund', function () {
        it('should refund a payment', function () {

        });
        it('should return 403 if the payment is not paid', async function () {

        });
        it('should return 404 if the payment does not exist', async function () {

        });
        it('should return 401 if the user is not authenticated correctly', async function () {

        });
    });

    describe('GET /get-amount-and-number-of-transactions', function () {

    });

    describe('GET /get-merchant', function () {

    });

    describe('GET /get-chart-data', function () {

    });
});