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

    });

    describe('GET /', function () {

    });

    describe('GET /:uuid/checkout', function () {

    });

    describe('POST /:uuid/cancel', function () {

    });

    describe('POST /:uuid/validate', function () {

    });

    describe('POST /:id/refund', function () {

    });

    describe('GET /get-amount-and-number-of-transactions', function () {

    });

    describe('GET /get-merchant', function () {

    });

    describe('GET /get-chart-data', function () {

    });
});