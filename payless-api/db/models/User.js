const {Model, DataTypes} = require("sequelize");

module.exports = function (connection) {
    class User extends Model {
        static currencies = ["EUR", "USD", "CHF", "GBP"];

        async checkPassword(password) {
            const bcrypt = require("bcryptjs");
            return bcrypt.compare(password, this.password);
        }

        async generateToken() {
            const jwt = require("jsonwebtoken");
            return jwt.sign({
                id: this.id,
                email: this.email,
                role: this.role,
            }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });
        }

        format() {
            const {
                // values to be removed
                password = null,
                // other values are kept
                ...safeUser
            } = this.dataValues;
            return safeUser;
        }
    }

    User.init(
        {
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
            },
            role: {
                type: DataTypes.ENUM("merchant", "merchant-to-validate", "refused", "admin"),
                defaultValue: "merchant-to-validate",
                allowNull: false,
            },
            company_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            zip_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            merchant_url: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isUrl: true,
                }
            },
            confirmation_url: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isUrl: true,
                }
            },
            cancel_url: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isUrl: true,
                }
            },
            currency: {
                type: DataTypes.ENUM(...User.currencies),
                allowNull: false,
                validate: {
                    isIn: function (value) {
                        if (!User.currencies.includes(value)) {
                            throw new Error(`User.currency must be one of ${User.currencies.join(", ")}`);
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

    User.addHook("beforeCreate", encryptPassword);
    User.addHook("beforeUpdate", encryptPassword);

    return User;
};
