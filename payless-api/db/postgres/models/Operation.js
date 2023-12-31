const {Model, DataTypes} = require("sequelize");
const {createOperationOnPaymentDocument, updateOperationOnPaymentDocument} = require("../../../hooks/hooks");

module.exports = function (connection) {
    class Operation extends Model {

        format() {
            return this.dataValues;
        }
    }

    Operation.init(
        {
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
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
                type: DataTypes.ENUM(["succeeded", "pending", "cancelled", "created"]),
                allowNull: false,
                defaultValue: "created",
            },
        },
        {
            sequelize: connection,
            tableName: "operation",
        }
    );

    Operation.addHook("afterCreate", (operation) => createOperationOnPaymentDocument(operation));
    Operation.addHook("afterUpdate", (operation) => updateOperationOnPaymentDocument(operation));

    return Operation;
};
