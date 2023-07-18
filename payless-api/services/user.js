const { Sequelize } = require("sequelize");
const { User } = require("../db");
const ValidationError = require("../errors/ValidationError");

module.exports = {
  findAll: async function (criteria, options = {}) {
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
      return await User.create(safeData);
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

  format: function (users) {
    if(users instanceof User) {
      return users.format();
    }

    return users.map(user => user.format());
  }
};


removeUnauthorizedFields = function (user) {
    const { token = null, uuid = null, ...safeUser } = user;
    return safeUser;
}
