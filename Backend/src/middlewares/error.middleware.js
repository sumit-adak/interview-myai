const AppError = require("../utils/AppError")

function notFound(req, res, next) {
    next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404))
}

function errorHandler(err, req, res, next) {
    if (err?.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            message: "Resume file is too large. Max allowed size is 5MB."
        })
    }

    if (err?.message === "Only PDF and DOCX files are allowed") {
        return res.status(400).json({ message: err.message })
    }

    const statusCode = err.statusCode || 500
    const isProduction = process.env.NODE_ENV === "production"

    if (!isProduction || statusCode >= 500) {
        console.error({
            message: err.message,
            stack: err.stack,
            method: req.method,
            url: req.originalUrl
        })
    }

    res.status(statusCode).json({
        message: statusCode >= 500 && isProduction ? "Internal Server Error" : err.message,
        ...(err.details ? { details: err.details } : {})
    })
}

module.exports = { notFound, errorHandler }
