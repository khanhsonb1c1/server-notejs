const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
  },
  
  full_name: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
    default: 'customer',
  },

  favoriteMusics:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Music",
    },
  ],

  favoriteAlbums:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
  ],
  favoriteSingers:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Singer",
    },
  ],

  password: {
    type: String,
    required: true,
    trim: true,
  },

  refreshToken: {
    type: String,
    // required: true,
  },

  updated_at: {
    type: Number,
    default: Math.round(+new Date() / 1000),
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
