const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },

  name: {
    type: String,
    requied: true,
  },

  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],

  singers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Singer",
    },
  ],

  ranker: {
    type: Number || null,
    requied: false,
    default: null,
  },

  music_url: {
    type: String,
    requied: true,
  },

  updated_at: {
    type: Number,
    default: Math.round(+new Date() / 1000),
    requied: true,
  },
});

const Music = mongoose.model("Music", musicSchema);

module.exports = { Music };
