const mongoose = require("mongoose");

const singerSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },

  // _id: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   default: function () {
  //     // Generate a custom ID with a specific length
  //     const idLength = 10;
  //     let id = '';
  //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //     for (let i = 0; i < idLength; i++) {
  //       id += characters.charAt(Math.floor(Math.random() * characters.length));
  //     }
  //     return id;
  //   },
  // },

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
