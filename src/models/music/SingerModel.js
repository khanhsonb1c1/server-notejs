const mongoose = require("mongoose");

const singerSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  image_url: {
    type: String,
    required: true,
  },

  local: {
    type: String,
    required: true,
    default: 'vn' // us-uk, 'cn'
  },

  musics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Music",
    },
  ],
  
  albums: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
  ],

  ranker: {
    type: Number,
    required: true,
    default: 0,
  },
  
  likes: {
    type: Number,
    required: true,
    default: 0,
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

const Singer = mongoose.model("Singer", singerSchema);

module.exports = { Singer };
