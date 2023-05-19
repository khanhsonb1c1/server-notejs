const { Singer } = require("../../models/music/SingerModel");
const cloudinary = require("../../services/cloudinary");
const fs = require("fs-extra");

const singerController = {
  create: async (req, res) => {
    try {
      const singer_save = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.CLOUDINARY_FOLDER_SINGER,
      });

      const newSinger = new Singer({
        id: req.body.id,
        name: req.body.name,
        image_url: singer_save.url,
        local: req.body.local,
        description: req.description,
      });

      // console.log(req.file)
      const saveSinger = await newSinger.save();

      await fs.remove(req.file.path);

      res.status(200).json({
        message: "add new singer successfully.",
        singer: saveSinger,
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

      const singers = await Singer.find()
        .skip(skip)
        .limit(PAGE_SIZE)
        .populate({
          path: "musics",
          select: "name -_id id updated_at ranker play_url",
        })
        .select("-albums");

      const total = Math.ceil(singers.length / PAGE_SIZE);

      res
        .status(200)
        .json({ data: singers, current_page: page, last_page: total });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  get_top_singer_vn: async (req, res) => {
    try {
      const singers = await Singer.find({local: "vn"})
        .limit(5)
      res
        .status(200)
        .json(singers);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  detail: async (req, res) => {
    try {
      const singer = await Singer.findOne({ id: req.params.id })
        .populate({
          path: "musics",
          select: "name id -_id updated_at ranker image_url play_url",
        })
        .populate({
          path: "albums",
          select: "id -_id name ranker",
        });
      res.status(200).json(singer);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  update: async (req, res) => {
    try {
      await Singer.findOneAndUpdate(
        { id: req.params.id },
        {
          $set: {
            ranker: req.body.ranker,
            name: req.body.name,
            local: req.body.local,
            description: req.description,
          },
        }
      );

      res
        .status(200)
        .json({ message: "Updated successfully !", updated: req.body });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = singerController;
