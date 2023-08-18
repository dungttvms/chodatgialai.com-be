const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Blog = require("../models/Blog");

const blogController = {};
blogController.createNewBlog = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  console.log(currentUserId);

  let { title, imageCover, descriptionTitle, descriptionDetail } = req.body;
  let blog = await Blog.create({
    title,
    imageCover,
    descriptionTitle,
    descriptionDetail,
    author: currentUserId,
  });
  blog = await blog.populate("author");
  return sendResponse(res, 200, true, blog, null, "Created Blog Success");
});

blogController.getAllBlogs = catchAsync(async (req, res, next) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;

  const count = await Blog.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    true,
    { blogs, totalPages, count },
    "Get Blogs Success"
  );
});

blogController.getSingleBlog = catchAsync(async (req, res, next) => {
  const blogId = req.params.blogId;

  const blog = await Blog.findById(blogId);
  if (!blog)
    throw new AppError(400, "Blog does not exist", "Get Single Blog Error");

  return sendResponse(res, 200, true, blog, null, "Get blog Success");
});

module.exports = blogController;
