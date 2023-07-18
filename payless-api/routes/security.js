const { Router } = require("express");

module.exports = function (userService) {
  const router = Router();

  router.post("/register", async function (req, res, next) {
    try {
      const data = req.body;
      data.role = 'merchant-to-validate';
      const user = await userService.create(data);
      res.json({
        ...user.format(),
        token: await user.generateToken()
      });
    } catch (e) {
      next(e);
    }
  });

  router.post("/login", async function (req, res, next) {
    try {
      const {email, password} = req.body;
      const user = await userService.findOneBy({email});
      if (!user) {
        return res.sendStatus(401);
      }
      if (!user.checkPassword(password)) {
        return res.sendStatus(401);
      }

      res.json({token: await user.generateToken()});
    } catch (e) {
      next(e)
    }
  });

  return router;
};
