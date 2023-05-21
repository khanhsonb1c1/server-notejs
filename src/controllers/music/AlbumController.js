const { Album } = require("../../models/music/AlbumModel");
const fs = require("fs-extra");
const { Singer } = require("../../models/music/SingerModel");
const cloudinary = require("../../services/cloudinary");
const { Music } = require("../../models/music/MusicModel");

const albumController = {
  create_any: async () => {
    try {
      for (let id = 2000; id < 2015; id++) {
        Album.create({
          id: id + 1,
          name: `Dữ liệu test ${id + 1}`,
          image_url:
            "https://res.cloudinary.com/dionk3ia2/image/upload/v1681224996/blogger/album/qozzw6uu9nuzc3dvailb.jpg",
          ranker: 100,
          updated_at: 1681224891,
          tag: ["64412671f44a7f59e0550a61"],
        });
      }
    } catch (error) {
      //
    }
  },
  get_album_top: async (req, res) => {
    try {
      const top100 = await Album.find({
        tags: {
          $all: "6442342da23ee8130e78c598",
        },
      })
        .populate({
          path: "musics",
          select: "-_id image_url play_url name id",
          populate: {
            path: "singers",
            select: "name id -_id",
          },
        })
        .populate({
          path: "tags",
          select: "id name",
        })
        .limit(5);

      const top_trending = await Album.find({
        tags: {
          $all: "64412671f44a7f59e0550a61",
        },
      })
        .populate({
          path: "musics",
          select: "-_id image_url play_url name id",
          populate: {
            path: "singers",
            select: "name id -_id",
          },
        })
        .populate({
          path: "tags",
          select: "id name",
        })
        .limit(5);

      res.status(200).json({
        top100: top100,
        top_recent: "empty",
        top_trending: top_trending,
      });
    } catch (error) {
      res.send(error);
    }
  },

  create: async (req, res) => {
    try {
      const image_save = await cloudinary.uploader.upload(req.file.path, {
        folder: process.env.CLOUDINARY_FOLDER_ALBUM,
      });

      const newAlbum = new Album({
        id: req.body.id,
        name: req.body.name,
        image_url: image_save.url,
        tags: req.body.tags,
        musics: req.body.musics,
      });

      await newAlbum.save();

      await fs.remove(req.file.path);

      res.status(200).json({
        message: "add new album successfully.",
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

      const page = parseInt(req.body.page) || 1;

      const skip = (page - 1) * PAGE_SIZE;
      //*========== END PAGINATE =============

      //* HANDLE FILTER ======================

      const filter = req.body.filter;

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

      //? case 3: filter singers
      let filter_singers = undefined;
      if (filter?.singers_id) {
        filter_tags = {
          singers: {
            $all: filter.singers_id,
          },
        };
      }

      let final_filter = undefined;
      if (filter) {
        final_filter = { ...filter_name, ...filter_tags, ...filter_singers };
      }
      //* END HANDLE FILTER ==================

      //*  =========== HANDLE SORT ============
      const sort = req.body.sort;

      let sort_updated = undefined;
      if (sort?.updated_at) {
        sort_updated = {
          updated_at: sort.updated_at,
        };
      }

      let sort_ranker = undefined;
      if (sort?.ranker) {
        sort_ranker = {
          ranker: sort.ranker,
        };
      }

      let final_sort = undefined;
      if (sort) {
        final_sort = { ...sort_updated, ...sort_ranker };
      }
      // //*  ===========END SORT ================

      //* GET IN DATABASE
      const albums = await Album.find(final_filter)
        .populate({
          path: "musics",
          select: "-_id image_url play_url name id",
          populate: {
            path: "singers",
            select: "name id -_id",
          },
        })
        .populate({
          path: "tags",
          select: "id name",
        })
        .skip(skip)
        .limit(PAGE_SIZE)
        .sort(final_sort);

      //* ========= END GET IN DATABASE ========

      //* ===== GET name singers in all musics =====
      const result = JSON.parse(JSON.stringify(albums));

      result.map((al) => {
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
        return al;
      });
      //* =====END GET name singers in all musics ====

      //* ======== TOTAL PAGE =============
      const total = Math.ceil(albums.length / PAGE_SIZE);
      //* ======== END TOTAL PAGE =========
      const items_count = await Album.count();
      //* RESPONSE
      res.status(200).json({
        data: result,
        current_page: page,
        last_page: total,
        total_items: items_count,
        count_items: albums.length,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  detail: async (req, res) => {
    try {
      const album = await Album.findOne({ id: req.params.id }).populate({
        path: "musics",
        select: "name id -_id image_url updated_at play_url likes views",
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
      await Album.findOneAndUpdate(
        { id: req.params.id },
        {
          $set: {
            name: req.body.name,
            ranker: req.body.ranker,
            tags: req.body.tags,
            views: req.body.views,
            likes: req.body.likes,
          },
        }
      );
      // const new_album = await Album.findById(req.params.id);
      res.status(200).json({
        message: "Update successfully !",
        updated: req.body,
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
