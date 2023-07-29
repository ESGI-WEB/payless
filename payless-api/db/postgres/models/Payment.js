const {Model, DataTypes} = require("sequelize");
const jwt = require("jsonwebtoken");
const constants = require("../../../helpers/constants");
const { createPaymentDocument, updatePaymentDocument } = require("../../../hooks/hooks");

module.exports = function (connection) {
    class Payment extends Model {

        generateLink() {
            return `${process.env.APP_URL}/payments/${this.uuid}/checkout`;
        }

        async notify(status = 'succeeded') {
            try {
                const user = await this.getUser();
                if (user.webhook_url) {
                    const jwt = require('jsonwebtoken');
                    const token = jwt.sign({
                        payment: this.format(),
                        status,
                    }, user.secret_token);
                    console.log(token)
                    await fetch(user.webhook_url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })
                }
            } catch (e) {
                console.error(e);
                // do nothing if client fail
            }
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
            client_field: { // can be anything
                type: DataTypes.STRING,
            },
            order_field: { // can be anything
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

    Payment.addHook("afterCreate", (payment) => createPaymentDocument(payment));
    Payment.addHook("afterUpdate", (payment) => updatePaymentDocument(payment));

    return Payment;
};
