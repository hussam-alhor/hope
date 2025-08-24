const express = require("express")
const { verifyToken } = require("../middelware/verifyToken")
const { createFeedback, getAllFeedback } = require("../controllers/feedbackController")

const router = express.Router()

router.route("/")
    .post(verifyToken, createFeedback)
    .get(getAllFeedback)

module.exports = router