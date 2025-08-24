const mongoose = require("mongoose")
const joi = require("joi")

const  FeedbackSchema = new mongoose.Schema({
 user: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User",
     required: true,
   },
   subject : {
    type: String,
    required: true,
    maxlength:50,
    minlength:3
   },
   message: {
    type: String,
    required: true,
    maxlength:200,
    minlength:3
   }
})

const Feedback = mongoose.model("Feedback", FeedbackSchema)

// validate create feedback 

const validateCreateFeedback = (obj) => {
  const schema = joi.object({
    subject: joi.string().min(3).max(50).required(),
    message: joi.string().min(3).max(200).required()
  })
  return schema.validate(obj)
}
module.exports = {
  Feedback,
  validateCreateFeedback
}