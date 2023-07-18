module.exports = function (req, res, next) {
    if (["POST", "PUT", "PATCH"].includes(req.method)) {

        let allowedContentType = "application/json"; // string or array

        // for user registration, we must use a form-data (kbis upload)
        if (req.path === "/register") {
            allowedContentType = "multipart/form-data";
        }

        if (!req.is(allowedContentType)) {
            return res.sendStatus(415);
        }
    }
    next();
}
