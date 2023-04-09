const { Blog } = require("../../models/blog/BlogModel");
const { Category } = require("../../models/blog/CategoryModel");

const blogController = {
  create: async (req, res) => {
    try {
      const newBlog = new Blog({
        id: req.body.id,
        content: req.body.content,
        description: req.body.description,
        title: req.body.title,
        categories: req.body.categories,
        author: req.body.author,
        image_url: req.body.image_url,
      });

      const saveBlog = await newBlog.save();

      // add
      if (req.body.categories) {
        const category = Category.findById(req.body.categories);

        await category.updateOne({
          $push: {
            blogs: saveBlog._id,
          },
        });
      }

      res.status(200).json({
        message: "add new blog successfully.",
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

  update: async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      await blog.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully !");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    try {
      //delete blog in category
      await Category.updateMany(
        { blogs: req.params.id },
        { $pull: { blogs: req.params.id } } // móc mấy cái blog có id = param id ( xóa đi)
      );

      await Blog.findByIdAndDelete(req.params.id);

      res.status(200).json("Deleted successfully !");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = blogController;
