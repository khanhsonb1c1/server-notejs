const { Music } = require("../../models/music/MusicModel");

const musicController = {
  create: async (req, res) => {
    try {
      const newMusic = new Music({
        id: req.body.id,
        content: req.body.content,
        description: req.body.description,
        title: req.body.title,
      });
      const saveBlog = await newMusic.save();

      res.status(200).json({
        message: "add new cart successfully.",
        blog: saveBlog,
      });
    } catch (error) {
      res.send(error);
    }
  },

  fetch: async (req, res) => {
    try {
      const musics = await Music.find();
      res.status(200).json(musics);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = musicController;
