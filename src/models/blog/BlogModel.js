const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },

  title: {
    type: String,
    required: true,
  },

  image_url:{
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  created_at: {
    type: Number,
    default: Math.round(+new Date() / 1000),
    required: true,
  },

  updated_at: {
    type: Number,
    default: Math.round(+new Date() / 1000),
    required: true,
  },

  countComments: {
    type: Number,
    required: true,
    default: 0,
  },

  countLikes: {
    type: Number,
    required: true,
    default: 0,
  },

    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = { Blog };
