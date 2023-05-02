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
        tags: req.body.tags,
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

  //! demo all function
  fetch: async (req, res) => {
    try {
      //* ====  HANDLE PAGINATE  ============
      const PAGE_SIZE = 12;

      const page = parseInt(req.query.page) || 1;

      const skip = (page - 1) * PAGE_SIZE;
      //*========== END PAGINATE =============


      //* HANDLE FILTER ======================

      const FILTER = req.body.filter

      




      //* END HANDLE FILTER ==================



      //* GET IN DATABASE
      const albums = await Album.find()
        .populate({
          path: "musics",
          select: "-_id image_url play_url name id",
          populate: {
            path: "singers",
            select: "name id -_id",
          },

        })
        .skip(skip)
        .limit(PAGE_SIZE);

      //* ========= END GET IN DATABASE ========  


      //* ===== GET name singers in all musics =====
      const result = JSON.parse(JSON.stringify(albums));

      result.map((al => {
        const names = [];
        al.musics.forEach((item) => {
        item.singers.forEach((item2) => {
          const check = names.find((m) => m == item2.name);
          if (!check) {
            names.push(item2.name);
          }
        });
      });
      al.singers_name = names.toString().replace((/,/gi, ", "));
      return al
      }))
      //* =====END GET name singers in all musics ====

      //* ======== TOTAL PAGE =============
      const total = Math.ceil(albums.length / PAGE_SIZE);
      //* ======== END TOTAL PAGE =========

      //* RESPONSE 
      res
        .status(200)
        .json({ data: result, current_page: page, last_page: total });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  detail: async (req, res) => {
    try {
      const album = await Album.findOne({ id: req.params.id }).populate({
        path: "musics",
        select: "name id -_id",
        populate: {
          path: "singers",
          select: "image_url name id -_id",
        },
      });

      const result = JSON.parse(JSON.stringify(album));

      const names = [];

      result.musics.forEach((item) => {
        item.singers.forEach((item2) => {
          const check = names.find((m) => m == item2.name);
          if (!check) {
            names.push(item2.name);
          }
        });
      });

      result.singers_name = names.toString().replace((/,/gi, ", "));

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  update: async (req, res) => {
    try {
      const album = await Album.findById(req.params.id);
      // $set: thay thế object
      await album.updateOne({
        $set: {
          name: req.body.name,
          ranker: req.body.ranker,
          tags: req.body.tags,
        },
      });
      const new_album = await Album.findById(req.params.id);
      res.status(200).json({
        message: "Update successfully !",
        data: new_album,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    try {
      await Music.updateMany(
        {
          album: req.params.id,
        },
        {
          album: null,
        }
      );

      await Singer.updateMany(
        {
          albums: req.params.id,
        },
        {
          $pull: {
            albums: req.params.id,
          },
        }
      );

      await Album.findByIdAndDelete(req.params.id);

      res.status(200).json("Deleted successfully !");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = albumController;
