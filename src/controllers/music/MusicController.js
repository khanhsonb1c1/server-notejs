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

      //*========= FILTER ========
      const filter = req.params.filter;

      //? case 1: filter name
      let filter_name = undefined;
      if (filter?.name) {
        filter_name = {
          name: { $regex: filter.name, $options: "i" },
        };
      }

      //? case 2: filter tags
      let filter_tags = undefined;
      if (filter?.tags_id) {
        filter_tags = {
          tags: {
            $all: filter.tags_id,
          },
        };
      }

      // //? case 3: filter album
      let filter_album = undefined;
      if (filter?.album) {
        filter_album = {
          album: filter.album,
        };
      }

      // //? case 4: filter singers
      let filter_singers = undefined;
      if (filter?.singers_id) {
        filter_singers = {
          singers: {
            $all: filter.singers_id,
          },
        };
      }

      let final_filter = undefined;

      if (filter) {
        final_filter = {
          ...filter_album,
          ...filter_name,
          ...filter_tags,
          ...filter_singers,
        };
      }

      //*========= END FILTER ========

      //* ====== SORT ==============
      const sort = req.params.sort;

      // //? case 1: sort updated_at
      let sort_updated = undefined;
      if (sort?.updated_at) {
        sort_updated = {
          updated_at: sort.updated_at,
        };
      }
      // //? case 1: sort updated_at
      let sort_views = undefined;
      if (sort?.views) {
        sort_views = {
          views: sort.views,
        };
      }

      let final_sort = undefined;

      if (sort) {
        final_sort = { ...sort_updated, ...sort_views };
      }

      //* GET LIST
      const musics = await Music.find(final_filter)
        .skip(skip)
        .limit(PAGE_SIZE)
        .populate({
          path: "singers",
          select: "id -_id name",
        })
        .populate({
          path: "tags",
          select: "id name",
        })
        .sort(final_sort);

      const musics_total = await Music.count();

      const total = Math.ceil(musics_total / PAGE_SIZE);

      //* GET name list:

      res.status(200).json({
        data: musics,
        current_page: page,
        last_page: total,
        total_item: musics_total,
        per_page: PAGE_SIZE,
        count_items: musics.length,
        // filter: final_filter,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  detail: async (req, res) => {
    try {
      const music = await Music.find({ id: req.params.id });
      res.status(200).json(music);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  update: async (req, res) => {
    try {
      // const music = await Music.find({id: req.params.id});
      // $set: thay thế object
      await Music.findOneAndUpdate(
        { id: req.params.id },
        {
          $set: {
            views: req.body.views,
            name: req.body.name,
            ranker: req.body.ranker,
            tags: req.body.tags,
          },
        }
      );

      res
        .status(200)
        .json({ mess: "Updated successfully !", updated: req.body });
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
      await Music.findOneAndRemove({ id: req.params.id });

      res.status(200).json("Deleted successfully !");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = musicController;
