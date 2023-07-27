const {Model, DataTypes} = require("sequelize");
const constants = require("../../../helpers/constants");
module.exports = function (connection) {
    class PaymentLog extends Model {

        format() {
            return this.dataValues;
        }
    }

    PaymentLog.init(
        {
            log: {
                type: DataTypes.STRING,
            }
        },
        {
            sequelize: connection,
            tableName: "payment_log",
        }
    );

    return PaymentLog;
};
