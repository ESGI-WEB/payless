const {Sequelize} = require("sequelize");
const {Operation} = require("../db/postgres");
const ValidationError = require("../errors/ValidationError");

module.exports = {
    findOneBy: async function (criteria = {}, options = {}) {
        return await Operation.findOne({
            where: criteria,
            ...options,
        });
    },
    create: async function (data) {
        try {
            return await Operation.create(data);
        } catch (e) {
            if (e instanceof Sequelize.ValidationError) {
                throw ValidationError.createFromSequelizeValidationError(e);
            }
            throw e;
        }
    },
    update: async function (criteria, data) {
        try {
            const [, operations = []] = await Operation.update(data, {
                where: criteria,
                returning: true,
                individualHooks: true,
            });

            return operations;
        } catch (e) {
            if (e instanceof Sequelize.ValidationError) {
                throw ValidationError.createFromSequelizeValidationError(e);
            }
            throw e;
        }
    },
    format: function (operations) {
        if (operations instanceof Operation) {
            return operations.format();
        }

        return operations.map(operation => operation.format());
    }
};
