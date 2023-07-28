const fs = require('fs');
const {Router} = require("express");
const multer = require('multer');
const ValidationError = require("../errors/ValidationError");
const mailerService = require("../services/mailer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = 'storage/upload/kbis/';
        if(!fs.existsSync(path)){
            fs.mkdirSync(path,{recursive:true});
        }
        cb(null, path);
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
                token: user.generateToken()
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
            if (!await user.checkPassword(password)) {
                return res.sendStatus(401);
            }

            res.json({token: user.generateToken()});
        } catch (e) {
            next(e)
        }
    });

    return router;
};
