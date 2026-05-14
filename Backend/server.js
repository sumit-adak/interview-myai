require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const env = require("./src/config/env")

connectToDB()

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`)
})
