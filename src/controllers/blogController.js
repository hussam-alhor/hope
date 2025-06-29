const expressAsyncHandler = require("express-async-handler");
const { Blog, validateCreateBlog, validateUpdateeBlog } = require("../model/Blog");
const path = require("path")
const fs = require("fs");
const { cloudinaryRemoveImage, cloudinaryRemoveMultipleImage } = require("../config/cloudinary");

/**
 * @desc Create a new blog post
 * @route POST /api/blogs
 * @access Private
 */
const createBlog = expressAsyncHandler(async (req, res) => {
  const { error } = validateCreateBlog(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

    if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  try {
    // استخدام البيانات من الميدل وير مباشرة
    const blog = await Blog.create({
      title: req.body.title,
      description: req.body.description,
      image: req.file.path,        // URL من Cloudinary
      imagePublicId: req.file.filename // public_id من Cloudinary
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @desc Get all blog posts
 * @route GET /api/blogs
 * @access Public
 */
const getBlogs = expressAsyncHandler(async (req, res) => {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.status(200).json(blogs);
});

/**
 * @desc Get a blog post by ID
 * @route GET /api/blogs/:id
 * @access Public
 */
const getBlogById = expressAsyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        res.status(404);
        throw new Error("Blog post not found");
    }

    res.status(200).json(blog);
});

/**
 * @desc Update a blog post by ID
 * @route PUT /api/blogs/:id
 * @access Private
 */
const updateBlog = expressAsyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }
    const { error } = validateUpdateeBlog(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    
    const updateData = {
    title: req.body.title,
    description: req.body.description
  };

  if (req.file) {
    try {
      // حذف الصورة القديمة إذا وجدت
      if (blog.imagePublicId) {
        await cloudinaryRemoveImage(blog.imagePublicId);
      }

      // استخدام البيانات الجديدة من الميدل وير
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    } catch (error) {
      return res.status(500).json({ message: "Error updating image" });
    }
  }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
        new: true
    });

    res.status(200).json(updatedBlog);
});

/**
 * @desc Delete a blog post by ID
 * @route DELETE /api/blogs/:id
 * @access Private
 */
const deleteBlog = expressAsyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        res.status(404);
        throw new Error("Blog post not found");
    }
    if (blog.imagePublicId) {
        try {
            await cloudinaryRemoveImage(blog.imagePublicId);
        } catch (error) {
            console.error("Error deleting image from Cloudinary:", error);
            return res.status(500).json({ message: "Error deleting image from Cloudinary" });
        }
    }
    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Blog post removed" });
});
/**
 * @desc delete all blogs
 * @route DELETE /api/blogs/
 * @access Private
 */
const deleteAllBlogs = expressAsyncHandler(async (req, res) => {
    const blogs = await Blog.find();

    if (blogs.length === 0) {
        return res.status(404).json({ message: "No blogs found" });
    }

    // حذف جميع الصور من Cloudinary
    const publicIds = blogs
        .filter(blog => blog.imagePublicId)
        .map(blog => blog.imagePublicId);

    try {
        await cloudinaryRemoveMultipleImage(publicIds);
    } catch (error) {
        console.error("Error deleting images from Cloudinary:", error);
        return res.status(500).json({ message: "Error deleting images from Cloudinary" });
    }

    // حذف جميع المدونات من قاعدة البيانات
    await Blog.deleteMany();

    return res.status(200).json({ message: "All blogs have been deleted" });
});
module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    deleteAllBlogs
};
