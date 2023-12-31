const {Model, DataTypes} = require("sequelize");
const jwt = require("jsonwebtoken");
const constants = require("../../../helpers/constants");

module.exports = function (connection) {
    class User extends Model {
        static roles = ["merchant", "merchant-to-validate", "refused", "admin"];


        async checkPassword(password) {
            const bcrypt = require("bcryptjs");
            return await bcrypt.compare(password, this.password);
        }

        generateToken() {
            const jwt = require("jsonwebtoken");
            return jwt.sign({
                id: this.id,
                email: this.email,
                role: this.role,
            }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
        }

        isToValidate() {
            return this.role === "merchant-to-validate";
        }

        isValid() {
            return ['merchant', 'admin'].includes(this.role);
        }

        isRefused() {
            return this.role === "refused";
        }

        format() {
            const {
                // values to be removed
                password = null,
                // other values are kept
                ...safeUser
            } = this.dataValues;
            safeUser.createdAt = safeUser.updatedAt.toString();
            safeUser.updatedAt = safeUser.updatedAt.toString();
            return safeUser;
        }
    }

    User.init(
        {
            secret_token: {
                type: DataTypes.STRING,
                unique: true,
            },
            client_token: {
                type: DataTypes.STRING,
                unique: true,
            },
            role: {
                type: DataTypes.ENUM(User.roles),
                defaultValue: "merchant-to-validate",
                allowNull: false,
                validate: {
                    isIn: function (value) {
                        if (!User.roles.includes(value)) {
                            throw new Error(`User.role must be one of ${User.roles.join(", ")}`);
                        }
                    },
                }
            },
            company_name: {
                type: DataTypes.STRING,
            },
            zip_code: {
                type: DataTypes.STRING,
            },
            city: {
                type: DataTypes.STRING,
            },
            address: {
                type: DataTypes.STRING,
            },
            country: {
                type: DataTypes.STRING,
            },
            merchant_url: {
                type: DataTypes.STRING,
                validate: {
                    is: function (value) {
                        if(!value.match(/^(http|https):\/\/(www\.)?[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})?(:\d+)?(\/[\w\/.-]*)*$/gm)) {
                            throw new Error("User.merchant_url is not valid");
                        }
                    },
                }
            },
            confirmation_url: {
                type: DataTypes.STRING,
                validate: {
                    is: function (value) {
                        if(!value.match(/^(http|https):\/\/(www\.)?[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})?(:\d+)?(\/[\w\/.-]*)*$/gm)) {
                            throw new Error("User.confirmation_url is not valid");
                        }
                    },
                }
            },
            cancel_url: {
                type: DataTypes.STRING,
                validate: {
                    is: function (value) {
                        if(!value.match(/^(http|https):\/\/(www\.)?[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})?(:\d+)?(\/[\w\/.-]*)*$/gm)) {
                            throw new Error("User.confirmation_url is not valid");
                        }
                    },
                }
            },
            webhook_url: {
                type: DataTypes.STRING,
                validate: {
                    is: function (value) {
                        if(!value.match(/^(http|https):\/\/(www\.)?[a-zA-Z0-9.-]+(\.[a-zA-Z]{2,})?(:\d+)?(\/[\w\/.-]*)*$/gm)) {
                            throw new Error("User.webhook is not valid");
                        }
                    },
                }
            },
            currency: {
                type: DataTypes.ENUM(...constants.CURRENCIES),
                validate: {
                    isIn: function (value) {
                        if (!constants.CURRENCIES.includes(value)) {
                            throw new Error(`User.currency must be one of ${constants.CURRENCIES.join(", ")}`);
                        }
                    },
                }
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    isEmail: true,
                    isNotNull: function (value) {
                        if (value === null) {
                            throw new Error("Email cannot be null");
                        }
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isNotNull: function (value) {
                        if (value === null) {
                            throw new Error("Password cannot be null");
                        }
                    },
                    // check if password contains at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number
                    is: function (value) {
                        if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
                            throw new Error("Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character among @$!%*?&");
                        }
                    },
                },
            },
            kbis: {
                type: DataTypes.STRING,
            }
        },
        {
            sequelize: connection,
            tableName: "users",
        }
    );

    async function encryptPassword(user, options) {
        if (!options?.fields.includes("password")) {
            return;
        }
        const bcrypt = require("bcryptjs");
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    async function generateTokens(user) {
        const randomstring = require("randomstring");
        const jwt = require("jsonwebtoken");

        const secret_token = randomstring.generate(50);
        const client_token = jwt.sign({}, secret_token);

        await user.update({secret_token, client_token});
    }

    User.addHook("beforeCreate", encryptPassword);
    User.addHook("afterCreate", generateTokens);
    User.addHook("beforeUpdate", encryptPassword);

    return User;
};
