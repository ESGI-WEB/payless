const {Model, DataTypes} = require("sequelize");
const constants = require("../../../helpers/constants");
const Operation = require("../../mongo/models/Operation");

module.exports = function (connection) {
    class Payment extends Model {

        generateLink() {
            return `${process.env.APP_URL}/payments/${this.uuid}/checkout`;
        }

        format() {
            const safeValues = {
                ...this.dataValues,
            };
            safeValues.checkout_link = this.generateLink();
            return safeValues;
        }
    }

    Payment.init(
        {
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                unique: true,
                allowNull: false,
            },
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
                type: DataTypes.ENUM(["succeeded", "processing", "pending", "cancelled"]),
                allowNull: false,
                defaultValue: "pending",
            },
        },
        {
            sequelize: connection,
            tableName: "payment",
        }
    );

    async function createPaymentDocument(user, options) {
        try {
            console.log(user)
            console.log(options)
            const paymentData = {
                total: user.total,
                currency: user.currency,
                client_field: user.client_field,
                order_field: user.order_field,
                status: user.status,
            };

            const newPayment = new Operation(paymentData);

            await newPayment.save();

            console.log("Payment document added to MongoDB:", newPayment);
        } catch (error) {
            console.error("Error creating payment document:", error);
        }
    }

    Payment.addHook("afterCreate", createPaymentDocument);

    return Payment;
};
