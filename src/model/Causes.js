const mongoose = require("mongoose")
const joi = require("joi")

const causesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength:100,
        minlength: 3
    },
     description: {
        type: String,
        required:true,
        trim:true,
        minlength:10,
    },
    image:{
        type: String,
        required:true
    },
    imagePublicId: {
         type: String, 
         required: true 
    },
    goal: {
        type: Number,
        required: true,
    },
    raised : {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const Cause = mongoose.model("Cause", causesSchema)

// validate create cause
const validateCreateCause = (obj)=> {
    const schema = joi.object({
        title: joi.string().required().min(3).max(100),
        description: joi.string().required().min(10),
        goal : joi.number().required()
    })
    return schema.validate(obj)
}
// validate update  cause
const validateUpdateCause = (obj)=> {
    const schema = joi.object({
        title: joi.string().min(3).max(100),
        description: joi.string().min(10),
        goal : joi.number()
    })
    return schema.validate(obj)
}

// validate donate amount
const validateDonateAmount = (obj) => {
    const schema = joi.object({
        amount: joi.number().positive().required()    
    });
    return schema.validate(obj);
};


module.exports = {
    Cause,
    validateCreateCause,
    validateUpdateCause,
    validateDonateAmount
}