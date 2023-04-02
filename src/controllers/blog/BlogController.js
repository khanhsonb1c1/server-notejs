const { Blog } = require("../../Models/blog/BlogModel");

const blogController = {
  create: async (req, res) => {
    try {
      const newBlog = new Blog({
        id: req.body.id,
        content: req.body.content,
        description: req.body.description,
        title: req.body.title,
        // countComments: req.body.countComments,
        // countLikes: req.body.countLikes,
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
      const blogs = await Blog.find();
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = blogController;
