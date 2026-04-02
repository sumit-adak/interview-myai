const multer = require("multer")


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowed = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]

        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Only PDF and DOCX files are allowed"))
        }

        cb(null, true)
    },
})


module.exports = upload
