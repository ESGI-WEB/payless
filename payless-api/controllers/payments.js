const paymentService = require("../services/payment");
const { TwingEnvironment, TwingLoaderFilesystem } = require("twing");
const loader = new TwingLoaderFilesystem("./views");
const twing = new TwingEnvironment(loader);
const { Operation, User } = require("../db/postgres");
const userService = require("../services/user");
const jwt = require("jsonwebtoken");
const operationService = require("../services/operation");

module.exports = function () {
  return {
    post: async function (req, res, next) {
      try {
        const data = req.body;

        if (!req.user?.id) {
          res.sendStatus(401);
        }

        data.UserId = req.user.id;

        const payment = await paymentService.create(data);

        res.status(201).json(paymentService.format(payment));
      } catch (e) {
        next(e);
      }
    },
    checkout: async function (req, res, next) {
      try {
        const payment = await paymentService.findOneBy({
          uuid: req.params.uuid,
        });

        if (!payment) {
          res.sendStatus(404);
        }

        if (!req.user?.id) {
          res.sendStatus(401);
        }
        const user = await userService.findById(req.user.id);

        if (!user) {
          res.sendStatus(401);
        }

        if (payment.status !== "pending") {
          res.sendStatus(403);
        }

        twing
            .render("checkout.twig", {
              payment,
              token: jwt.sign({}, user.secret_token, { expiresIn: "1h" }), // temp token
              merchant_id: user.id,
              cancel_url: `${process.env.APP_URL}/payments/${payment.uuid}/cancel`,
              cancelled_url: user.cancel_url,
              validate_url: `${process.env.APP_URL}/payments/${payment.uuid}/validate`,
              confirmation_url: user.confirmation_url,
            })
            .then((output) => {
              res.end(output);
            });
      } catch (e) {
        next(e);
      }
    },
    validate: async function (req, res, next) {
      try {
        const payment = await paymentService.findOneBy(
            {
              uuid: req.params.uuid,
            },
            {
              include: Operation,
            }
        );

        if (!payment) {
          res.sendStatus(404);
        }

        if (payment.status !== "pending") {
          res.sendStatus(403);
        }

        await paymentService.validate(payment.uuid, req.body);

        res.sendStatus(200);
      } catch (e) {
        next(e);
      }
    },
    cancel: async function (req, res, next) {
      try {
        const payment = await paymentService.findOneBy(
            {
              uuid: req.params.uuid,
            },
            {
              include: Operation,
            }
        );

        if (!payment) {
          res.sendStatus(404);
        }
        if (payment.status !== "pending") {
          res.sendStatus(403);
        }
        const operations = await payment.getOperations();
        if (
            operations?.length &&
            operations.some(
                (operation) =>
                    operation.status === "succeeded" && operation.type === "capture"
            )
        ) {
          res.sendStatus(403);
        }

        await paymentService.update(
            { uuid: req.params.uuid },
            { status: "cancelled" }
        );

        res.sendStatus(200);
      } catch (e) {
        next(e);
      }
    },
    cget: async (req, res, next) => {
      const {
        _page = 1,
        _itemsPerPage = 10,
        _sort = {},
        ...criteria
      } = req.query;
      try {
        const data = await paymentService.findAll(criteria, {
          offset: (_page - 1) * _itemsPerPage,
          limit: _itemsPerPage,
          order: _sort,
        });
        res.json(data);
      } catch (err) {
        next(err);
      }
    },
    getAmountAndNumberOfTransactions: async (req, res, next) => {
      const { currency, ...otherCriteria } = req.query;

      if (!currency) {
        return res
            .status(400)
            .json({ error: "Currency parameter is required." });
      }

      try {
        const data = await paymentService.getAmountAndNumberOfTransactions(
            currency,
            otherCriteria
        );
        res.json(data);
      } catch (err) {
        next(err);
      }
    },
    getMerchant: async (req, res, next) => {
      const { ...criteria } = req.query;
      try {
        const data = await paymentService.getMerchant(criteria);
        res.json(data);
      } catch (err) {
        next(err);
      }
    },
    getChartData: async (req, res, next) => {
      const { ...criteria  } = req.query;
      try {
        const data = await paymentService.getChartData(criteria);
        res.json(data);
      } catch (err) {
        next(err);
      }
    },
  };
};
