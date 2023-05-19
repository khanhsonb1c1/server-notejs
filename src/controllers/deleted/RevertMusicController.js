const { DeleteMusic } = require("../../models/deleted/deletedMusicModel");
const { Album } = require("../../models/music/AlbumModel");
const { Music } = require("../../models/music/MusicModel");
const { Singer } = require("../../models/music/SingerModel");

const revertMusicController = {
  revert: async (req, res) => {
    try {
      const record = await DeleteMusic.findOne({ id: req.params.id });

      const newMusic = new Music({
        id: req.params.id,
        name: record.name,
        tags: record.tags,
        album: record.album,
        singers: record.singers,
        ranker: record.ranker,
        views: record.views,
        likes: record.likes,
        image_url: record.image_url,
        play_url: record.play_url,
        isDeleted: false,
      });

      const saveMusic = await newMusic.save();

      await DeleteMusic.findOneAndRemove({ id: req.params.id });

      //* push to singer document
      if (saveMusic.singers.length) {
        saveMusic.singers.forEach(async (item) => {
          const singer = Singer.findById(item.toString())
          await singer.updateOne({
            $push: {
              musics: saveMusic._id
            }
          })
        });
      }

      //* push to album document
      if (saveMusic.album) {
        const album = await Album.findById(saveMusic.album.toString());
        await album.updateOne({
          $push: { musics: saveMusic._id },
        });
      }

      res.status(200).json({
        message: "revert successfully.",
        save: saveMusic,
      });
    } catch (error) {
      res.send(error);
    }
  },
};

module.exports = revertMusicController;
