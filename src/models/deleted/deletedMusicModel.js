const mongoose = require("mongoose");

const deleteMusicSchema = new mongoose.Schema({
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
  views: {
    type: Number,
    required: true,
    default: 0,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },

  image_url: {
    type: String,
    required: false,
  },

  play_url: {
    type: String,
    required: true,
  },

  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },

  updated_at: {
    type: Number,
    default: Math.round(+new Date() / 1000),
    required: true,
  },
});

const DeleteMusic = mongoose.model("DeleteMusic", deleteMusicSchema);

module.exports = { DeleteMusic };
