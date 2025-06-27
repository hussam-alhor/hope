const express = require("express")
const { verifyToken, verifyTokenAndOnlyAdmin } = require("../middelware/verifyToken")
const { createWalletRequestCtrl, getAllWalletRequestsCtrl, updateWalletRequestCtrl } = require("../controllers/walletRequestController")

const router = express.Router()

router.route("/")
    .post(verifyToken , createWalletRequestCtrl)
    .get(verifyTokenAndOnlyAdmin , getAllWalletRequestsCtrl)

// /api/wallet-requests/:id
router.route("/:id")
  .put(verifyTokenAndOnlyAdmin, updateWalletRequestCtrl); 

module.exports = router