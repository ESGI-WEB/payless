const {Model, DataTypes} = require("sequelize");

module.exports = function (connection) {
    class Operation extends Model {

        format() {
            return this.dataValues;
        }
    }

    Operation.init(
        {
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    min: 0,
                }
            },
            last4: {
                type: DataTypes.STRING,
            },
            type: {
                type: DataTypes.ENUM(["capture", "refund"]),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM(["succeeded", "pending", "failed"]),
                allowNull: false,
            },
        },
        {
            sequelize: connection,
            tableName: "operation",
        }
    );

    return Operation;
};
