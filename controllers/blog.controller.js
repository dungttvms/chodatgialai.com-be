const { catchAsync, sendResponse, AppError } = require("../helpers/utils");
const Blog = require("../models/Blog");

const blogController = {};
blogController.createNewBlog = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;

  let { title, type, imageCover, descriptionTitle, descriptionDetail } =
    req.body;
  let blog = await Blog.create({
    title,
    type,
    imageCover,
    descriptionTitle,
    descriptionDetail,
    author: currentUserId,
  });
  blog = await blog.populate("author").execPopulate();
  return sendResponse(res, 200, true, blog, null, "Created Blog Success");
});

blogController.getAllBlogs = catchAsync(async (req, res, next) => {
  let { page, limit, type } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;
  const filterConditions = [{ isDeleted: false }];
  if (type) {
    filterConditions.push({ type: type });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Blog.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let blogs = await Blog.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(
    res,
    200,
    true,
    { blogs, totalPages, count },
    "Get All Blogs Success"
  );
});

blogController.getSingleBlog = catchAsync(async (req, res, next) => {
  const blogId = req.params.blogId;

  const blog = await Blog.findById(blogId);
  if (!blog)
    throw new AppError(400, "Blog does not exist", "Get Single Blog Error");

  return sendResponse(res, 200, true, blog, null, "Get blog Success");
});

blogController.updateSingleBlog = catchAsync(async (req, res, next) => {
  const blogId = req.params.blogId;
  let blog = await Blog.findById(blogId);
  if (!blog) throw new AppError(400, "Blog not found", "Updated Blog error");

  const allows = [
    "title",
    "type",
    "imageCover",
    "descriptionTitle",
    "descriptionDetail",
  ];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      blog[field] = req.body[field];
    }
  });
  await blog.save();
  return sendResponse(
    res,
    200,
    true,
    blog,
    null,
    "Updated Single Blog Successful"
  );
});

blogController.deleteSingleBlog = catchAsync(async (req, res, next) => {
  const blogId = req.params.blogId;
  let blog = await Blog.findByIdAndUpdate(
    { _id: postId },
    { isDeleted: true },
    { new: true }
  );

  if (!blog)
    throw new AppError(404, "Blog not found", "Delete Single Blog Error");
  return sendResponse(
    res,
    200,
    true,
    blog,
    null,
    "Deleted Single Blog Success"
  );
});

module.exports = blogController;
