const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  deleteAllBlogs,
} = require("../controllers/blogController");
const photoUpload = require("../middelware/photoStorage");
const { verifyTokenAndOnlyAdmin } = require("../middelware/verifyToken");
const { validateObjectId } = require("../middelware/validateObjectId");
const router = express.Router();

router.route("/")
  .get(getBlogs)
  .post(verifyTokenAndOnlyAdmin , photoUpload.single("image"), createBlog)
  .delete(deleteAllBlogs)

router.route("/:id")
  .get(verifyTokenAndOnlyAdmin,validateObjectId ,getBlogById)
  .put(verifyTokenAndOnlyAdmin ,validateObjectId ,photoUpload.single("image"), updateBlog)
  .delete( verifyTokenAndOnlyAdmin ,validateObjectId ,deleteBlog);

module.exports = router;
