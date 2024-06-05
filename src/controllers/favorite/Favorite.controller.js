const musicFavoriteService = require("../../services/favorite/music.favorite.service");

const favoriteController = {
  add: async (req, res) => {
    try {
      const { email, musicId } = req.body;
      const status = await musicFavoriteService.addFavorite(email, musicId);
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = favoriteController;
