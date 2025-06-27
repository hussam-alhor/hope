const express = require("express")
const { verifyTokenAndOnlyAdmin } = require("../middelware/verifyToken")
const { getAllUsersCtrl } = require("../controllers/userController")

const router = express.Router()

router.route("/")
    .get(verifyTokenAndOnlyAdmin , getAllUsersCtrl)


module.exports = router