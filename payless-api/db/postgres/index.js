const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const connection = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});
const db = {
  connection,
};

fs.readdirSync(path.join(__dirname, "models")).forEach((file) => {
  const model = require(path.join(__dirname, "models", file))(connection);
  db[model.name] = model;
});

db.User.hasMany(db.Payment);
db.Payment.belongsTo(db.User);

db.Payment.hasMany(db.Operation);
db.Operation.belongsTo(db.Payment);

db.Payment.hasMany(db.PaymentLog);
db.PaymentLog.belongsTo(db.Payment);

module.exports = db;
