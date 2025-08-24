const expressAsyncHandler = require("express-async-handler");
const {WalletRequest, validateRequestWallet} = require("../model/walletRequestSchema ");
const { User } = require("../model/User");

/**
 * @desc create new request
 * @route /api/wallet-requests
 * @access only logged user
 */
module.exports.createWalletRequestCtrl = expressAsyncHandler(async (req, res) => {
  const {error} = validateRequestWallet(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const request = await WalletRequest.create({
    user: req.user.id,
    amount: req.body.amount,
  });

  res.status(201).json(request)
});

/**
 * @desc GET wallet request
 * @route /api/wallet-requests
 * @access Private (only admin)
 */
module.exports.getAllWalletRequestsCtrl = expressAsyncHandler(async (req, res) => {
  const requests = await WalletRequest.find().populate("user", "userName email");
  res.status(200).json(requests) 
});
/**
 * @desc update wallet
 * @route /api/wallet-requests/:id
 * @access Private (only admin)
 */

module.exports.updateWalletRequestCtrl = expressAsyncHandler(async (req, res) => {
  const request = await WalletRequest.findById(req.params.id);
  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  // التحقق من القيمة المرسلة
  if (!["approved", "rejected"].includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  request.status = req.body.status;
  await request.save();

  // إذا تم الموافقة، زيادة رصيد المستخدم
  if (req.body.status === "approved") {
    await User.findByIdAndUpdate(request.user, {
      $inc: { wallet: request.amount },
    });
  }
  res.status(200).json(request);
});

/**
 * @desc get wallet request for user
 * @route /api/wallet-requests/:id
 * @access Private (only admin)
 */
module.exports.getUserRequestsCtrl = expressAsyncHandler(async (req, res) => {
  const requests = await WalletRequest.find({ user: req.user.id });
  res.status(200).json(requests);
});