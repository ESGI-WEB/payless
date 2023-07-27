const sequelize = require('../db/postgres');

module.exports = function (Service) {
  return {
    cget: async (req, res, next) => {
      const {
        _page = 1,
        _itemsPerPage = 10,
        _sort = {},
        ...criteria
      } = req.query;
      try {

        const totalItem = await Service.count(criteria);

        const data = await Service.findAll(criteria, {
          offset: (_page - 1) * _itemsPerPage,
          limit: _itemsPerPage,
          order: _sort,
        });
        //res.json('format' in Service ? Service.format(data) : data);
        res.json({
          totalItem,
          data: 'format' in Service ? Service.format(data) : data,
        });
      } catch (err) {
        next(err);
      }
    },
    post: async (req, res, next) => {
      try {
        const data = await Service.create(req.body);
        res.status(201).json('format' in Service ? Service.format(data) : data);
      } catch (err) {
        next(err);
      }
    },
    get: async (req, res, next) => {
      try {
        const data = await Service.findById(parseInt(req.params.id));
        if (!data) return res.sendStatus(404);
        res.json('format' in Service ? Service.format(data) : data);
      } catch (err) {
        next(err);
      }
    },
    put: async (req, res, next) => {
      const transaction = await sequelize.connection.transaction();
      try {
        const targetId = parseInt(req.params.id);
        const nbRemoved = targetId ? await Service.remove({ id: targetId }) : 0;
        const newData = req.body;
        if (nbRemoved) {
          newData.id = targetId;
        }

        const data = await Service.create(newData);
        transaction.commit();
        res.status(nbRemoved ? 200 : 201).json('format' in Service ? Service.format(data) : data);
      } catch (err) {
        transaction.rollback();
        next(err);
      }
    },
    patch: async (req, res, next) => {
      try {
        const [data] = await Service.update(
          { id: parseInt(req.params.id) },
          req.body
        );
        if (!data) return res.sendStatus(404);
        res.json('format' in Service ? Service.format(data) : data);
      } catch (err) {
        next(err);
      }
    },
    delete: async (req, res, next) => {
      try {
        const nbRemoved = await Service.remove({ id: parseInt(req.params.id) });
        res.sendStatus(nbRemoved ? 204 : 404);
      } catch (err) {
        next(err);
      }
    },
  };
};
