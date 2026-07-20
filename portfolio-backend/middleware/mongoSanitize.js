function sanitize(obj) {
    if (!obj || typeof obj !== "object") return obj;

    for (const key in obj) {
        if (key.startsWith("$") || key.includes(".")) {
            delete obj[key];
            continue;
        }

        sanitize(obj[key]);
    }

    return obj;
}

module.exports = (req, res, next) => {
    sanitize(req.body);
    sanitize(req.params);

    // req.query is readonly in Express 5
    sanitize(req.query);

    next();
};