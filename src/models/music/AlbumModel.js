const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  singers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Singer",
    },
  ],

  ranker: {
    type: Number || null,
    required: false,
    default: null,
  },

  musics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Music",
    },
  ],

  updated_at: {
    type: Number,
    default: Math.round(+new Date() / 1000),
    required: true,
  },
});

const Album = mongoose.model("Album", albumSchema);

module.exports = { Album };
