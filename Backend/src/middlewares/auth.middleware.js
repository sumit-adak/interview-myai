const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
const env = require("../config/env")
const AppError = require("../utils/AppError")

const blacklistCache = new Map()
const CACHE_TTL = 5 * 60 * 1000

setInterval(() => {
    const now = Date.now()
    for (const [token, expiresAt] of blacklistCache) {
        if (expiresAt <= now) blacklistCache.delete(token)
    }
}, 60 * 1000)

async function authUser(req, res, next) {
    const headerToken = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null
    const token = req.cookies.token || headerToken

    if (!token) {
        return next(new AppError("Token not provided.", 401))
    }

    if (blacklistCache.has(token)) {
        return next(new AppError("Token is invalid", 401))
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token })
    if (isTokenBlacklisted) {
        blacklistCache.set(token, Date.now() + CACHE_TTL)
        return next(new AppError("Token is invalid", 401))
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return next(new AppError("Invalid token.", 401))
    }
}

module.exports = { authUser }
