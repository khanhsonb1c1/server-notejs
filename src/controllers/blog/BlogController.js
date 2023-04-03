const { Blog } = require("../../models/blog/BlogModel");

const blogController = {
  create: async (req, res) => {
    try {
      const newBlog = new Blog({
        id: req.body.id,
        content: req.body.content,
        description: req.body.description,
        title: req.body.title,
      });
      const saveBlog = await newBlog.save();

      res.status(200).json({
        message: "add new cart successfully.",
        blog: saveBlog,
      });
    } catch (error) {
      res.send(error);
    }
  },

  fetch: async (req, res) => {
    try {
      const PAGE_SIZE = 12;

      const page = parseInt(req.query.page) || 1;

      const skip = (page - 1) * PAGE_SIZE;

      const blogs = await Blog.find().skip(skip).limit(PAGE_SIZE);

      const total = Math.ceil(blogs.length / PAGE_SIZE);

      res
        .status(200)
        .json({ data: blogs, current_page: page, last_page: total });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  detail: async (req, res) => {
    try {
      const blog = await Blog.findOne({ id: req.params.id });
      res.status(200).json(blog);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = blogController;
