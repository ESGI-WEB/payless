
module.exports = () => {
    return async (req, res, next) => {
        try {
            // fake bearer token used for authentication
            // in reality we would use a secret with a public key or an API key
            const tokens = [
                'sdhjfgjhsf7867867GHFSFGHJFGUqugfyuqsfqf786778F7S8TFGhg<sufgqsft!SQ!FTQTFSUGQhf'
            ];

            const token = req.headers.authorization.split(" ")[1];

            if (!tokens.includes(token)) {
                res.sendStatus(401);
            }

            next();
        } catch (error) {
            res.sendStatus(401);
        }
    };
};