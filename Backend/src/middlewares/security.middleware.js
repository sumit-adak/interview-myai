function securityHeaders(req, res, next) {
    res.setHeader("X-Content-Type-Options", "nosniff")
    res.setHeader("X-Frame-Options", "DENY")
    res.setHeader("Referrer-Policy", "no-referrer")
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    res.setHeader("Cross-Origin-Resource-Policy", "same-site")
    next()
}

function sanitizeBody(req, res, next) {
    if (!req.body || typeof req.body !== "object") return next()

    for (const key of Object.keys(req.body)) {
        if (key.startsWith("$") || key.includes(".")) {
            delete req.body[key]
        }
    }

    next()
}

module.exports = { securityHeaders, sanitizeBody }
