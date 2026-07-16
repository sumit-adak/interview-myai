function createRateLimiter({ windowMs, max, message }) {
    const hits = new Map()

    const cleanupInterval = setInterval(() => {
        const now = Date.now()
        for (const [key, entry] of hits) {
            if (entry.resetAt <= now) hits.delete(key)
        }
    }, windowMs)
    if (cleanupInterval.unref) cleanupInterval.unref()

    return (req, res, next) => {
        const key = `${req.ip}:${req.method}:${req.baseUrl || req.path}`
        const now = Date.now()
        const entry = hits.get(key)

        if (!entry || entry.resetAt <= now) {
            hits.set(key, { count: 1, resetAt: now + windowMs })
            res.setHeader("X-RateLimit-Limit", String(max))
            res.setHeader("X-RateLimit-Remaining", String(max - 1))
            res.setHeader("X-RateLimit-Reset", String(Math.ceil((now + windowMs) / 1000)))
            return next()
        }

        entry.count += 1

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
