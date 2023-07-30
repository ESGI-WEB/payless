const assert = require('assert');
const {faker} = require('@faker-js/faker');
const {Op} = require("sequelize");
const sinon = require('sinon');

describe('Unit - Operation service', function () {
    beforeEach(function () {
        // prevent console.log
        sinon.stub(console, 'log');
        sinon.stub(console, 'error');
    });

    afterEach(function () {
        sinon.restore();
    });

    describe('#findOneBy()', function () {

    });

    describe('#create()', function () {

    });

    describe('#update()', function () {

    });

    describe('#format()', function () {

    });
});