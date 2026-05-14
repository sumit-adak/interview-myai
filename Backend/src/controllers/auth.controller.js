const authService = require("../services/auth.service")
const catchAsync = require("../utils/catchAsync")

const cookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000
})

const registerUserController = catchAsync(async (req, res) => {
    const data = await authService.registerUser(req.body)
    res.cookie("token", data.token, cookieOptions())
    res.status(201).json({
        message: "User registered successfully",
        ...data
    })
})

const loginUserController = catchAsync(async (req, res) => {
    const data = await authService.loginUser(req.body)
    res.cookie("token", data.token, cookieOptions())
    res.status(200).json({
        message: "User logged in successfully",
        ...data
    })
})

const logoutUserController = catchAsync(async (req, res) => {
    const headerToken = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null
    const token = req.cookies.token || headerToken

    await authService.logoutUser(token)
    res.clearCookie("token", cookieOptions())
    res.status(200).json({ message: "User logged out successfully" })
})

const getMeController = catchAsync(async (req, res) => {
    const user = await authService.getCurrentUser(req.user.id)
    res.status(200).json({
        message: "User details fetched successfully",
        user
    })
})

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}
