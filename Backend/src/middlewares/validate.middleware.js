const AppError = require("../utils/AppError")

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query
    })

    if (!result.success) {
        const details = result.error.errors.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message
        }))
        return next(new AppError("Validation failed", 400, details))
    }

    req.body = result.data.body || req.body
    req.params = result.data.params || req.params
    req.query = result.data.query || req.query
    return next()
}

module.exports = validate
