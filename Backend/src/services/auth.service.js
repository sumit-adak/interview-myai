const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const env = require("../config/env")
const userModel = require("../models/user.model")
const tokenBlacklistModel = require("../models/blacklist.model")
const AppError = require("../utils/AppError")

const publicUser = (user) => ({
    id: user._id,
    username: user.username,
    email: user.email
})

const signToken = (user) => jwt.sign(
    { id: user._id, username: user.username },
    env.JWT_SECRET,
    { expiresIn: "1d" }
)

async function registerUser({ username, email, password }) {
    const existing = await userModel.findOne({
        $or: [{ username }, { email }]
    }).lean()

    if (existing) {
        throw new AppError("Account already exists with this email address or username", 409)
    }

    const hash = await bcrypt.hash(password, 12)
    const user = await userModel.create({ username, email, password: hash })

    return {
        token: signToken(user),
        user: publicUser(user)
    }
}

async function loginUser({ email, password }) {
    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
        throw new AppError("Invalid email or password", 401)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401)
    }

    return {
        token: signToken(user),
        user: publicUser(user)
    }
}

async function logoutUser(token) {
    if (token) {
        await tokenBlacklistModel.updateOne(
            { token },
            { $setOnInsert: { token } },
            { upsert: true }
        )
    }
}

async function getCurrentUser(userId) {
    const user = await userModel.findById(userId)
    if (!user) {
        throw new AppError("User not found", 404)
    }
    return publicUser(user)
}

module.exports = { registerUser, loginUser, logoutUser, getCurrentUser }
