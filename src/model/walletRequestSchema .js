const mongoose = require("mongoose");
const joi = require("joi")
const walletRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const WalletRequest = mongoose.model("WalletRequest", walletRequestSchema);

const validateRequestWallet  = (obj)=> {
    const schema = joi.object({
        amount : joi.number().min(1).required()
    })
    return schema.validate(obj)
} 

module.exports = {
    WalletRequest,
    validateRequestWallet
}