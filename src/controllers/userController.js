const expressAyncHandler = require("express-async-handler")
const {User} = require("../model/User")

/**
 * @desc get all users
 * @route /api/users
 * @method GET
 * @access private (only admin)
 */
module.exports.getAllUsersCtrl = expressAyncHandler(async(req,res)=>{
    const users = await User.find().select("-password")
    return res.status(200).json(users)
})