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

describe('Integration - /operations', function () {
    let token;
    beforeEach(async function () {
        // prevent console.log
        sinon.stub(console, 'log');
        sinon.stub(console, 'error');
        sinon.stub(Payment, 'notify');
    });

    afterEach(function () {
        sinon.restore();
    });

    describe('POST /mark-as-done', function () {
        it('should update operation', function () {

        });
        it('should return 404 if not found', function () {

        });
        it('should return 401 if not authenticated', function () {

        });
        it('should return 401 if not right token', function () {

        });
        it('should return 403 if encoded data are wrong', function () {

        });
    });
});