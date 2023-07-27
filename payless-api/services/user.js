const { Sequelize, Op } = require("sequelize");
const { User } = require("../db/postgres");
const ValidationError = require("../errors/ValidationError");
const constants = require("../helpers/constants");
const mailerService = require("./mailer");

module.exports = {
  findAll: async function (criteria = {}, options = {}) {
    return User.findAll({
      where: criteria,
      ...options,
      order: Object.entries(options.order || {}),
    });
  },
  findById: async function (id) {
    return User.findByPk(id);
  },
  findOneBy: async function (criteria) {
    return User.findOne({
      where: criteria,
    });
  },
  create: async function (data) {
    try {
      const safeData = removeUnauthorizedFields(data);
      if(!safeData.role || safeData.role !== 'admin') {
        checkMerchantDataValidity(safeData);
      }
      const user = await User.create(safeData);
      if (user.isToValidate()) {
        await mailerService.sendRegistrationMail(user.email);
      }
      return user;
    } catch (e) {
      if (e instanceof Sequelize.ValidationError) {
        throw ValidationError.createFromSequelizeValidationError(e);
      }
      throw e;
    }
  },
  update: async function (criteria, data) {
    try {
      const safeData = removeUnauthorizedFields(data);
      const usersToUpdate = await User.findAll({
        where: criteria,
      });

      if ((safeData.role && safeData.role !== 'admin') || usersToUpdate.some(user => user.role !== 'admin')) {
        checkMerchantDataValidity(safeData, true);
      }

      const [nb, users = []] = await User.update(safeData, {
        where: criteria,
        returning: true,
        individualHooks: true,
      });

      return users;
    } catch (e) {
      if (e instanceof Sequelize.ValidationError) {
        throw ValidationError.createFromSequelizeValidationError(e);
      }
      throw e;
    }
  },
  remove: async function (criteria) {
    return User.destroy({
      where: criteria,
    });
  },
  getAllowedOrigins: async function () {
    const users = await User.findAll({
      where: {
        role: {[Op.in]: ['merchant', 'admin']},
      },
    });

    return users.map(user => user.merchant_url);
  },
  format: function (users) {
    if(users instanceof User) {
      return users.format();
    }

    return users.map(user => user.format());
  }
};


removeUnauthorizedFields = function (user) {
    const { token = null, ...safeUser } = user;
    return safeUser;
}

checkMerchantDataValidity = function (user, checkOnlyPassedFields = false) {
  const requiredFieldsNotMandatoryForDb = [
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
    'kbis',
    'email',
    'password',
  ];

  let fieldsToCheck = requiredFieldsNotMandatoryForDb;
  if (checkOnlyPassedFields) {
    // update mode, we check only fields that we ant to update and make sur their new value is valid
    fieldsToCheck = requiredFieldsNotMandatoryForDb.filter(field => field in user);
  }

  const fieldsNotFilled = fieldsToCheck.filter(field => !(field in user) || !user[field] || user[field]?.trim() === '');

  if (fieldsNotFilled.length > 0) {
    const errors = fieldsNotFilled.reduce((acc, field) => {
        acc[field] = [`User.${field} is required`];
        return acc;
    });
    throw new ValidationError('Missing required fields', errors);
  }

  return true;
}