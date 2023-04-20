const { Music } = require("../../models/music/MusicModel");
const { Album } = require("../../models/music/AlbumModel");
const { Singer } = require("../../models/music/SingerModel");
const cloudinary = require("../../services/cloudinary");
const fs = require("fs-extra");

const musicController = {
  create: async (req, res) => {
    try {
      const song_save = await cloudinary.uploader.upload(
        req.files.image_url[0].path,
        {
          folder: process.env.CLOUDINARY_FOLDER_SONG,
        }
      );

      const music_save = await cloudinary.uploader.upload(
        req.files.play_url[0].path,
        {
          folder: process.env.CLOUDINARY_FOLDER_MUSIC,
          resource_type: "video",
          format: "mp3",
        }
      );

      // remove file saved in public/data
      if (req.body.image_url) {
        await fs.remove(req.files.image_url[0].path);
      }
      await fs.remove(req.files.play_url[0].path);

      const newMusic = new Music({
        id: req.body.id,
        name: req.body.name,
        tag: req.body.tag,
        album: req.body.album,
        image_url: song_save.url,
        singers: req.body.singers,
        play_url: music_save.url,
      });

      const saveMusic = await newMusic.save();

      // // add music to album
      if (req.body.album) {
        // add music vao album
        const album = Album.findById(req.body.album);
        await album.updateOne({
          // $push: thêm truong _id  vào array Album, push chỉ dùng cho array
          $push: {
            musics: saveMusic._id,
          },
        });
      }
      // // add music to singer
      if (req.body.singers) {
        // add music to Singer
        const singer = Singer.findById(req.body.singers);
        await singer.updateOne({
          // $push: thêm trường _id vào array Singer
          $push: {
            musics: saveMusic._id,
          },
        });
      }

      res.json({
        message: "add new music successfully.",
        music: saveMusic,
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

      const musics = await Music.find().skip(skip).limit(PAGE_SIZE);

      const total = Math.ceil(musics.length / PAGE_SIZE);

      res.status(200).json({
        data: musics,
        current_page: page,
        last_page: total,
        per_page: PAGE_SIZE,
        count_items: musics.length,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  detail: async (req, res) => {
    try {
      const music = await Music.findOne({ id: req.params.id });
      res.status(200).json(music);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  update: async (req, res) => {
    try {
      const music = await Music.findById(req.params.id);
      // $set: thay thế object
      await music.updateOne({ $set: req.body });
      res.status(200).json("Updated successfully !");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    try {
      // delete music in album
      await Album.updateMany(
        // $pull: móc cái cần tìm ra từ arr ( xóa đi)
        { musics: req.params.id },
        { $pull: { musics: req.params.id } } // móc mấy cái music có id = param id ( xóa đi)
      );

      //delete music in singer
      await Singer.updateMany(
        // $pull: móc cái cần tìm ra từ arr ( xóa đi)
        { singers: req.params.id },
        { $pull: { singers: req.params.id } } // móc mấy cái music có id = param id ( xóa đi)
      );

      // delete music
      await Music.findByIdAndDelete(req.params.id);

      res.status(200).json("Deleted successfully !");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = musicController;
