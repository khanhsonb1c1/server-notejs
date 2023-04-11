const { Album } = require("../../models/music/AlbumModel");
const fs = require("fs-extra");
const { Singer } = require("../../models/music/SingerModel");

const cloudinary = require("../../services/cloudinary");
const { Music } = require("../../models/music/MusicModel");

const albumController = {
  create: async (req, res) => {
    try {
      const image_save = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.CLOUDINARY_FOLDER_ALBUM,
      });

      const newAlbum = new Album({
        id: req.body.id,
        name: req.body.name,
        singer: req.body.singer,
        image_url: image_save.url,
        // musics: req.body.musics,
      });

      const saveAlbum = await newAlbum.save();

      await fs.remove(req.file.path);

      // add album to singer
      if (req.body.singer) {
        const singer = await Singer.findById(req.body.singer);
        await singer.updateOne({
          $push: {
            albums: saveAlbum._id,
          },
        });
      }

      res.status(200).json({
        message: "add new album successfully.",
        album: saveAlbum,
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

      const albums = await Album.find().skip(skip).limit(PAGE_SIZE);

      const total = Math.ceil(albums.length / PAGE_SIZE);

      res
        .status(200)
        .json({ data: albums, current_page: page, last_page: total });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  detail: async (req, res) => {
    try {
      const album = await Album.findOne({ id: req.params.id });
      res.status(200).json(album);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  update: async (req, res) => {
    try {
      const music = await Album.findById(req.params.id);
      // $set: thay thế object
      await music.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully !");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    try {
      const music = Music.find({
        album: req.params.id,
      });
      await music[0].updateOne({
        $push: { album: "" },
      });

      await Singer.updateMany(
        { albums: req.params.id },
        { $pull: { albums: req.params.id } }
      );

      await Album.findByIdAndDelete(req.params.id);

      res.status(200).json("Deleted successfully !");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = albumController;
