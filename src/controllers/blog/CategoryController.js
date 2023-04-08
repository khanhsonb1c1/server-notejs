const { Blog } = require("../../models/blog/BlogModel");
const { Category } = require("../../models/blog/CategoryModel");

const categoryController = {
  create: async (req, res) => {
    try {
      const newCategory = new Category({
        id: req.body.id,
        name: req.body.name,
      });
      const saveCategory = await newCategory.save();

      res.status(200).json({
        message: "add new category successfully.",
        music: saveCategory,
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

      const categories = await Category.find().skip(skip).limit(PAGE_SIZE);

      const total = Math.ceil(categories.length / PAGE_SIZE);

      res
        .status(200)
        .json({ data: categories, current_page: page, last_page: total });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  detail: async (req, res) => {
    try {
      const music = await Category.findOne({ id: req.params.id });
      res.status(200).json(music);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  update: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      // $set: thay thế object
      await category.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully !");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    try {
      // delete categories in blog
      await Blog.updateMany(
        { categories: req.params.id },
        { $pull: { categories: req.params.id } } 
      );

      // delete category
      await Category.findByIdAndDelete(req.params.id);

      res.status(200).json("Deleted successfully !");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = categoryController;
