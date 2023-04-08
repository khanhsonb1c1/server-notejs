const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  tags: [ 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],

  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
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

  image_url: {
    type: String,
    required: true,
  },


  updated_at: {
    type: Number,
    default: Math.round(+new Date() / 1000),
    required: true,
  },
});

const Music = mongoose.model("Music", musicSchema);

module.exports = { Music };
