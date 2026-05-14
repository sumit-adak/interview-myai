const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: true,
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.use((err, req, res, next) => {
    if (err?.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            message: "Resume file is too large. Max allowed size is 5MB."
        })
    }

    if (err?.message === "Only PDF and DOCX files are allowed") {
        return res.status(400).json({
            message: err.message
        })
    }

    return next(err)
})



module.exports = app
