const expressAsyncHandler = require("express-async-handler");
const { Blog, validateCreateBlog, validateUpdateeBlog } = require("../model/Blog");
const path = require("path")
const fs = require("fs");

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

  // التأكد من وجود الملف
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const { title, description } = req.body;
  
  // استخدام رابط الصورة من Cloudinary
  const image = req.file.path; 

  const blog = await Blog.create({
    title,
    description,
    image,
  });

  res.status(201).json(blog);
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
        res.status(404).json({ message: "Blog not found" });
    }
    const { error } = validateUpdateeBlog(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });;
    }
    // حذف الصورة القديمة إذا تم رفع صورة جديدة
  if (req.file && blog.image) {
    const oldImagePath = path.join(__dirname, `../images/${blog.image}`);
    if (fs.existsSync(oldImagePath)) {
      try {
        fs.unlinkSync(oldImagePath);
      } catch (err) {
        res.status(400).json({message: "Error deleting old image"});
      }
    }
  }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        image: req.file.filename
    }, {
        new: true
    })

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
    // حذف الصورة المرتبطة
    if (blog.image) {
      const imagePath = path.join(__dirname, `../images/${blog.image}`);

        // التحقق من وجود الملف قبل الحذف
        if (fs.existsSync(imagePath)) {
            try {
                fs.unlinkSync(imagePath);
                console.log("Deleted image:", imagePath);
            } catch (err) {
                console.error("Failed to delete image:", err);
            }
        }
    }
    await Blog.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: "Blog post removed" });
});
/**
 * @desc delete all blogs
 * @route DELETE /api/blogs/
 * @access Private
 */
const deleteAllBlogs = expressAsyncHandler(async (req, res) => {
    const blogs = await Blog.find()
    if (blogs.length == 0) {
        return res.status(400).json({ message: "No blogs founded" })
    }
     // حذف جميع الصور أولاً
  blogs.forEach(blog => {
    if (blog.image) {
      const imagePath = path.join(__dirname, `../images/${blog.image}`);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log("Deleted image:", imagePath);
        } catch (err) {
          console.error("Failed to delete image:", err);
        }
      }
    }
  });
    await Blog.deleteMany()
    return res.status(200).json({ message: "All blogs deleted" })
})
module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    deleteAllBlogs
};
