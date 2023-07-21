const {Model, DataTypes} = require("sequelize");
const constants = require("../../helpers/constants");
module.exports = function (connection) {
    class Payment extends Model {

        format() {
            return this.dataValues;
        }
    }

    Payment.init(
        {
            total: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    min: 0,
                }
            },
            currency: {
                type: DataTypes.ENUM(constants.CURRENCIES),
                allowNull: false,
            },
            client_field: {
                type: DataTypes.STRING,
            },
            order_field: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.ENUM(["succeeded", "pending", "failed"]),
                allowNull: false,
            },
        },
        {
            sequelize: connection,
            tableName: "payment",
        }
    );

    return Payment;
};
