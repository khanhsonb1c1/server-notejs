const { User } = require("../../models/user/UserModal");

const musicFavoriteService = {
  addFavorite: async (email, musicId) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      // Kiểm tra xem musicId đã có trong favoriteMusics chưa
      const musicIndex = user.favoriteMusics.indexOf(musicId);

      if (musicIndex > -1) {
        // Nếu đã có, remove musicId khỏi favoriteMusics
        user.favoriteMusics.splice(musicIndex, 1);
        await user.save();
        return { success: true, message: "Music removed from favorites" };
      } else {
        // Nếu chưa có, thêm musicId vào favoriteMusics
        user.favoriteMusics.push(musicId);
        await user.save();
        
        return { success: true, message: "Music added to favorites" };
      }
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = musicFavoriteService;
