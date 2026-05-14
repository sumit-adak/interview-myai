function createRateLimiter({ windowMs, max, message }) {
    const hits = new Map()

    return (req, res, next) => {
        const key = `${req.ip}:${req.method}:${req.baseUrl || req.path}`
        const now = Date.now()
        const entry = hits.get(key)

        if (!entry || entry.resetAt <= now) {
            hits.set(key, { count: 1, resetAt: now + windowMs })
            return next()
        }

        entry.count += 1
        hits.set(key, entry)

        res.setHeader("X-RateLimit-Limit", String(max))
        res.setHeader("X-RateLimit-Remaining", String(Math.max(0, max - entry.count)))
        res.setHeader("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)))

        if (entry.count > max) {
            return res.status(429).json({ message })
        }

        return next()
    }
}

module.exports = createRateLimiter
