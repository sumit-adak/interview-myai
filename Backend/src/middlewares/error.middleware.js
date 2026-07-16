function notFound(req, res, next) {
    res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` })
}

function errorHandler(err, req, res, _next) {
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
            requestId: req.id,
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
