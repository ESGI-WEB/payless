const { Sequelize } = require("sequelize");
const { Payment, Operation, connection } = require("../db/postgres");
const ValidationError = require("../errors/ValidationError");
const ServiceError = require("../errors/ServiceError");
const operationService = require("./operation");
const { connectToDatabase, closeDatabaseConnection } = require("../db/mongo");

const findOneBy = async function (criteria = {}, options = {}) {
  return await Payment.findOne({
    where: criteria,
    ...options,
  });
};

const create = async function (data) {
  try {
    return await Payment.create(data);
  } catch (e) {
    if (e instanceof Sequelize.ValidationError) {
      throw ValidationError.createFromSequelizeValidationError(e);
    }
    throw e;
  }
};

const update = async function (criteria, data) {
  try {
    const [, payments = []] = await Payment.update(data, {
      where: criteria,
      returning: true,
      individualHooks: true,
    });

    return payments;
  } catch (e) {
    if (e instanceof Sequelize.ValidationError) {
      throw ValidationError.createFromSequelizeValidationError(e);
    }
    throw e;
  }
};

const validate = async function (uuid, data) {
  const transaction = await connection.transaction();
  try {
    const {
      card_number = null,
      cardholder_name = null,
      expiration_date = null,
      cvv = null,
    } = data;

    const errorsFields = {};
    if (!card_number || !card_number.trim()) {
      errorsFields["card_number"] = ["card_number is required"];
    } else if (!card_number.replaceAll(" ", "").match(/^[0-9]{16}$/)) {
      errorsFields["card_number"] = ["card_number is invalid"];
    }

    if (!cardholder_name || !cardholder_name.trim()) {
      errorsFields["cardholder_name"] = ["cardholder_name is required"];
    }

    if (!expiration_date || !expiration_date.trim()) {
      errorsFields["expiration_date"] = ["expiration_date is required"];
    } else if (!expiration_date.match(/^[0-9]{2}\/[0-9]{4}$/)) {
      errorsFields["expiration_date"] = ["expiration_date is invalid"];
    } else {
      const [month, year] = expiration_date.split("/");
      const now = new Date();
      const currentDateFormatted =
        (now.getMonth() + 1).toString().padStart(2, "0") +
        "/" +
        now.getFullYear();
      if (
        new Date(year, parseInt(month) - 1) < now &&
        expiration_date !== currentDateFormatted
      ) {
        errorsFields["expiration_date"] = ["expiration_date is passed"];
      }
    }

    if (!cvv || !cvv.trim()) {
      errorsFields["cvv"] = ["cvv is required"];
    } else if (!cvv.match(/^[0-9]{3}$/)) {
      errorsFields["cvv"] = ["cvv is invalid"];
    }

    if (Object.keys(errorsFields).length > 0) {
      throw new ValidationError(errorsFields);
    }

    const payment = (await update({ uuid }, { status: "processing" }))[0];
    const amount = payment.total;
    const currency = payment.currency;

    const operation = await operationService.create({
      amount,
      last4: card_number.slice(-4),
      type: "capture",
      PaymentId: payment.id,
    });

    const jwt = require("jsonwebtoken");
    const pspQuery = await fetch(process.env.PSP_URL + "/payments/capture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.PSP_TOKEN,
      },
      body: JSON.stringify({
        card_number,
        cardholder_name,
        expiration_date,
        cvv,
        amount,
        currency,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " +
            jwt.sign({ operationId: operation.uuid }, process.env.JWT_SECRET),
        },
        url:
          process.env.BASE_PSP_URL_NOTIFICATION +
          `/operations/${operation.uuid}/mark-as-done`,
      }),
    });

    if (pspQuery.status != 202) {
      if (pspQuery.status == 422) {
        throw new ValidationError(await pspQuery.json());
      }
      throw new ServiceError("PSP error");
    }

    await operationService.update(
      { uuid: operation.uuid },
      { status: "pending" }
    );

    transaction.commit();
    return payment;
  } catch (e) {
    transaction.rollback();
    if (e instanceof Sequelize.ValidationError) {
      throw ValidationError.createFromSequelizeValidationError(e);
    }
    throw e;
  }
};

const findAll = async function (criteria = {}, options = {}) {
  let paymentCollection = null;
  try {
    paymentCollection = await connectToDatabase();
    let query = paymentCollection.find(criteria);

    if (options.order !== {}) {
      query = query.sort(options.order);
    }

    if (options.offset) {
      const offset = parseInt(options.offset);
      query = query.skip(offset);
    }

    if (options.limit) {
      const limit = parseInt(options.limit);
      query = query.limit(limit);
    }

    return await query.toArray();
  } catch (e) {
    console.error("Error while retrieving payment summary:", err);
  } finally {
    if (paymentCollection) {
      await closeDatabaseConnection();
    }
  }
};

const getAmountAndNumberOfTransactions = async function (currency, criteria = {}) {
  let paymentCollection = null;
  try {
    paymentCollection = await connectToDatabase();

    const cursor = await paymentCollection.aggregate([
      {
        $match: { currency, ...criteria },
      },
      {

        $group: {
          _id: null,
          number_of_transactions: {
            $sum: 1,
          },
          total_amount: {
            $sum: {
              $toDouble: "$total",
            },
          },
          currency: {
            $first: "$currency",
          },
        },
      },
      {
        $project: {
          _id: 0,
          number_of_transactions: 1,
          total_amount: 1,
          currency: 1,
        },
      },
    ]);

    return await cursor.toArray();
  } catch (err) {
    console.error("Error while retrieving payment summary:", err);
  } finally {
    if (paymentCollection) {
      await closeDatabaseConnection();
    }
  }
};

const getMerchant = async function (criteria = {}) {
  let paymentCollection = null;
  try {
    paymentCollection = await connectToDatabase();

    const cursor = await paymentCollection.aggregate([
      {
        $group: {
          _id: null,
          number_of_merchant: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          number_of_merchant: 1,
        },
      },
    ]);

    return await cursor.toArray();
  } catch (err) {
    console.error("Error while retrieving payment summary:", err);
  } finally {
    if (paymentCollection) {
      await closeDatabaseConnection();
    }
  }
};

const getChartData = async function (criteria = {}) {
  let paymentCollection = null;
  try {
    paymentCollection = await connectToDatabase();

    const matchCriteria = {};
    if (criteria.startDate && criteria.endDate) {
      matchCriteria.created_date = {
        $gte: new Date(criteria.startDate),
        $lte: new Date(criteria.endDate),
      };
    }

    let dateFormat = "%Y-%m-%d";
    if (criteria.time === "year") {
      dateFormat = "%Y";
    } else if (criteria.time === "month") {
      dateFormat = "%Y-%m";
    }

    const cursor = await paymentCollection.aggregate([
      {
        $match: matchCriteria,
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$created_date" } },
          total: { $sum: { $toDouble: "$total" } },
        },
      },
      {
        $project: {
          date: "$_id",
          total: 1,
          _id: 0,
        },
      },
    ]);

    return await cursor.toArray();
  } catch (err) {
    console.error("Error while retrieving payment summary:", err);
  } finally {
    if (paymentCollection) {
      await closeDatabaseConnection();
    }
  }
};

const format = function (payments) {
  if (payments instanceof Payment) {
    return payments.format();
  }

  return payments.map((payment) => payment.format());
};

module.exports = {
  findOneBy,
  create,
  update,
  validate,
  format,
  findAll,
  getAmountAndNumberOfTransactions,
  getMerchant,
  getChartData
};
