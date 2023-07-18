const fs = require('fs');
const {Router} = require("express");
const multer = require('multer');
const ValidationError = require("../errors/ValidationError");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'storage/upload/kbis/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '.pdf');
    },
});
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const errors = [];
        // only allow pdf
        if (file.mimetype !== 'application/pdf') {
            errors.push('Only pdf are allowed');
        }

        if (errors.length) {
            cb(new ValidationError({[file.fieldname]: errors}));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    }
});

module.exports = function (userService) {
    const router = Router();

    router.post("/register", upload.single('kbis'), async function (req, res, next) {
        try {
            const data = req.body;

            if (!req.file) {
                throw new ValidationError({kbis: ['kbis is required']});
            }
            data.kbis = req.file.filename;

            data.role = 'merchant-to-validate';
            const user = await userService.create(data);

            res.json({
                ...user.format(),
                token: await user.generateToken()
            });
        } catch (e) {
            // remove file uploaded
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error(err);
                });
            }
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
