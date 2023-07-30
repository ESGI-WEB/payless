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

describe('Integration - /operations', function () {
    beforeEach(async function () {
        // prevent console.log
        sinon.stub(console, 'log');
        sinon.stub(console, 'error');
    });

    afterEach(function () {
        sinon.restore();
    });

    describe('POST /mark-as-done', function () {

    });
});