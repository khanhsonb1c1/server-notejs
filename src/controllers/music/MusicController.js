const { Music } = require("../../models/music/MusicModel");
const { DeleteMusic } = require("../../models/deleted/deletedMusicModel");
const { Album } = require("../../models/music/AlbumModel");
const { Singer } = require("../../models/music/SingerModel");
const cloudinary = require("../../services/cloudinary");
const fs = require("fs-extra");
// const { default: mongoose } = require("mongoose");

const musicController = {

  // search all

  searchAll: async (req, res) => {
    try {

      const search = req.query.search;

      const musics = await Music.find({  name: { $regex: search, $options: "i" }, });

      const albums = await Album.find({ name: { $regex: search, $options: "i" }, });

      const singers = await Singer.find({ name: { $regex: search, $options: "i" },})


      res.json({
      
        musics: musics,
        albums: albums,
        singers: singers
      })
      
    } catch (error) {
      req.json(error)
    }
  },
 

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
        tags: req.body.tags,
        album: req.body.album,
        image_url: song_save.url,
        singers: req.body.singers,
        play_url: music_save.url,
      });

      const saveMusic = await newMusic.save();

      // add music to album
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
      const musics = await Music.find({ ...final_filter, isDeleted: "false" })
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
      const music = await Music.findOne({ id: req.params.id, isDeleted: "false" }).populate("album");

      if (music) {
        res.status(200).json(music);
      } else {
        res.status(500).json({ message: "Can not find this music" });
      }
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

  // updateAll: async (req, res) => {
  //   try {
  //     await Music.updateMany({}, { $set: { isDeleted: false} })

  //     res
  //       .status(200)
  //       .json({ mess: "Updated all successfully !"});
  //   } catch (error) {
  //     res.status(500).json(error);
  //   }
  // },

  delete: async (req, res) => {
    try {
      // delete music
      // await Music.findOneAndRemove({ id: req.params.id });

      //* Solution 1: set isDeleted = true, when fetch, check isDeleted = fase.
      // await Music.findOneAndUpdate({ id: req.params.id }, {
      //   $set: {
      //     isDeleted: true
      //   }
      // })

      //* Solution 2: Move to new Collection, and remove record

      const record_id = req.params.id;

      const record = await Music.findOne({ id: record_id });

      const newRecord = new DeleteMusic({
        _id: record._id,
        id: record_id,
        name: record.name,
        tags: record.tags,
        album: record.album,
        singers: record.singers,
        ranker: record.ranker,
        views: record.views,
        likes: record.likes,
        image_url: record.image_url,
        play_url: record.play_url,
        isDeleted: true,
      });


      await newRecord.save();

      await Music.findOneAndRemove({ id: record_id });

      // delete music in album
      await Album.updateMany(
        // $pull: móc cái cần tìm ra từ arr ( xóa đi)
        { musics: record._id },
        { $pull: { musics: record._id } } // móc cái music có id = param id ( xóa đi)
      );

      // //delete music in singer
      await Singer.updateMany(
        // $pull: móc cái cần tìm ra từ arr ( xóa đi)
        { musics: record._id},
        { $pull: { musics: record._id} } // móc mấy cái music có id = param id ( xóa đi)
      );

      res
        .status(200)
        .json({ message: "Deleted successfully !"});
    } catch (error) {
      res.status(500).json(error);
    }
  },

  create_any: async (req, res) => {
    try {
      res.status(200).json("comming soon !");
      // let i = 3000;
      // for(let id = 1; id < 5; id++){
      //  await Music.create({
      //     id: i +1,
      //     name: `Dữ liệu test music 2 ${id+1}`,
      //     image_url: "https://res.cloudinary.com/dionk3ia2/image/upload/v1681224996/blogger/album/qozzw6uu9nuzc3dvailb.jpg",
      //     likes: 1000,
      //     views: 1000,
      //     play_url: "https://res.cloudinary.com/dionk3ia2/video/upload/v1681231150/blogger/music/pksgj5zfbg3ddmxcqtjg.mp3",
      //     ranker: i + 1,
      //     updated_at: Math.round(+new Date() / 1000),
      //     singers: ["645789521dadde4f2e8f95f1"],
      //     album: "64658be7e36469f68fcc09a9",
      //     tags: "64412653f44a7f59e0550a5d",
      //     isDeleted: false,
      //   })
      // }
    } catch (error) {
      //
    }
  },
};

module.exports = musicController;
