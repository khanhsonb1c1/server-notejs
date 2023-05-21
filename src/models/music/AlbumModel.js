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

  image_url:{
    type: String,
    required: true,
  },

  // singers: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Singer",
  //   },
  // ],

  tags:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    }
  ],

  ranker: {
    type: Number,
    required: true,
    default: 0,
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

  musics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Music",
      required: false,
    },
  ],

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

const Album = mongoose.model("Album", albumSchema);


module.exports = { Album };
