const mongoose = require("mongoose")
const joi = require("joi");
const blogShema = mongoose.Schema({
    title: {
        type:String,
        required:true,
        trim:true,
        maxlength:100,
        minlength:3
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
    }
},{
    timestamps:true
})

const Blog = mongoose.model("Blog", blogShema)


// validate create blog
const validateCreateBlog = (obj)=> {
    const schema = joi.object({
        title: joi.string().trim().min(3).max(100).required(),
        description: joi.string().trim().min(10).required(),
        // image: joi.required()
    })
    return schema.validate(obj)
}
// validate update blog
const validateUpdateeBlog = (obj)=> {
    const schema = joi.object({
        title: joi.string().trim().min(3).max(100),
        description: joi.string().trim().min(10)
    })
    return schema.validate(obj)
}
module.exports = {
    Blog , validateCreateBlog , validateUpdateeBlog
}