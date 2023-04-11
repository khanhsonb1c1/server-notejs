const { Tag } = require("../../models/music/TagModel");

const tagController = {
  create: async (req, res) => {
    try {
      const newTag = new Tag({
        id: req.body.id,
        name: req.body.name,
      });

      // console.log(req.file)
      const saveTag = await newTag.save();


      res.status(200).json({
        message: "add new tag successfully.",
        singer: saveTag,
      });
    } catch (error) {
      res.send(error);
    }
  },

  fetch: async (req, res) => {
    try {
      const tags = await Tag.find();
      res.status(200).json({ data: tags });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  detail: async (req, res) => {
    try {
      const tag = await Tag.findOne({ id: req.params.id });
      res.status(200).json(tag);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  update: async (req, res) => {
    try {
      const tag = await Tag.findById(req.params.id);
      await tag.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully !");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    try {
      await Tag.findByIdAndDelete(req.params.id);
      res.status(200).json("Delete successfully !");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = tagController;
