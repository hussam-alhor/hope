const expressAsyncHandler = require("express-async-handler");
const { validateCreateFeedback, Feedback } = require("../model/Feedback");

/**
 * @desc create feedback
 * @method POST
 * @route /api/feedback
 * @access logged user
 */
const createFeedback = expressAsyncHandler(async(req,res)=> {
  const {error} = validateCreateFeedback(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const feedback = await Feedback.create({
     user: req.user.id,
     subject: req.body.subject,
     message: req.body.message
  })
  return res.status(201).json(feedback)
})


/**
 * @desc get all feedback
 * @method GET
 * @route /api/feedback
 * @access public
 */

const getAllFeedback = expressAsyncHandler(async(req,res)=> {
    const feedbacks = await Feedback.find().populate("user", "userName email");
    return res.status(200).json(feedbacks)
})

module.exports = {
    createFeedback,
    getAllFeedback
}