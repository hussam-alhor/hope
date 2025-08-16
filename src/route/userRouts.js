const express = require("express")
const { verifyTokenAndOnlyAdmin, verifyToken } = require("../middelware/verifyToken")
const { getAllUsersCtrl, getUserById } = require("../controllers/userController")

const router = express.Router()

router.route("/")
    .get(verifyTokenAndOnlyAdmin , getAllUsersCtrl)


router.route("/:id")
    .get(verifyToken,getUserById)

module.exports = router