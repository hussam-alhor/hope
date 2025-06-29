const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  deleteAllBlogs,
} = require("../controllers/blogController");
const cloudinaryUpload  = require("../middelware/photoStorage");
const { verifyTokenAndOnlyAdmin } = require("../middelware/verifyToken");
const { validateObjectId } = require("../middelware/validateObjectId");
const router = express.Router();

router.route("/")
  .get(getBlogs)
  .post(verifyTokenAndOnlyAdmin , cloudinaryUpload.single("image"), createBlog)
  .delete(verifyTokenAndOnlyAdmin,deleteAllBlogs)

router.route("/:id")
  .get(verifyTokenAndOnlyAdmin,validateObjectId ,getBlogById)
  .put(verifyTokenAndOnlyAdmin ,validateObjectId ,cloudinaryUpload.single("image"), updateBlog)
  .delete( verifyTokenAndOnlyAdmin ,validateObjectId ,deleteBlog);

module.exports = router;
