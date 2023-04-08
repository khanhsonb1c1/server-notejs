const { Album } = require("../../models/music/AlbumModel");

const albumController = {
  create: async (req, res) => {
    try {
      const newAlbum = new Album({
        id: req.body.id,
        name: req.body.name,
        singers: req.body.singer,
        musics: req.body.musics,  
        musics: req.body.musics,      
      });
      
      const saveAlbum = await newAlbum.save();

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
};

module.exports = albumController;
