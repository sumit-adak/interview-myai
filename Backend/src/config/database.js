const mongoose = require("mongoose")
const env = require("./env")



async function connectToDB() {

    try {
        await mongoose.connect(env.MONGO_URI)

        console.log("Connected to Database")
    }
    catch (err) {
        console.error("Database connection failed:", err.message)
        process.exit(1)
    }
}

module.exports = connectToDB
