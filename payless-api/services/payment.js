const { Sequelize } = require("sequelize");
const { Payment, User} = require("../db");
const ValidationError = require("../errors/ValidationError");
const constants = require("../helpers/constants");
const mailerService = require("./mailer");

module.exports = {
  findOneBy: async function (criteria = {}, options = {}) {
    return await Payment.findOne({
      where: criteria,
      ...options,
    });
  },
  create: async function (data) {
    try {
      return await Payment.create(data);
    } catch (e) {
      if (e instanceof Sequelize.ValidationError) {
        throw ValidationError.createFromSequelizeValidationError(e);
      }
      throw e;
    }
  },
  update: async function (criteria, data) {
    try {
      const [, payments = []] = await Payment.update(data, {
        where: criteria,
        returning: true,
        individualHooks: true,
      });

      return payments;
    } catch (e) {
      if (e instanceof Sequelize.ValidationError) {
        throw ValidationError.createFromSequelizeValidationError(e);
      }
      throw e;
    }
  },
  format: function (payments) {
    if(payments instanceof Payment) {
      return payments.format();
    }

    return payments.map(payment => payment.format());
  }
};
