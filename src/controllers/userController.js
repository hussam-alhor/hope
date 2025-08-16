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

/**
 * @desc get user by id
 * @route /api/users/:id
 * @method GET
 * @access private (only logged user)
 */
module.exports.getUserById = expressAyncHandler(async(req,res)=>{ 
    const user = await User.findById(req.params.id).select("-password")
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    return res.status(200).json(user)
})