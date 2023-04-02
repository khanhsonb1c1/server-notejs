const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },

  title: {
    type: String,
    requied: true,
  },

  description: {
    type: String,
    requied: true,
  },

  content: {
    type: String,
    requied: true,
  },

  created_at: {
    type: Number,
    default: Math.round(+new Date() / 1000),
    requied: true,
  },

  updated_at: {
    type: Number,
    default: Math.round(+new Date() / 1000),
    requied: true,
  },

  countComments: {
    type: Number,
    requied: true,
    default: 0,
  },

  countLikes: {
    type: Number,
    requied: true,
    default: 0,
  },

  //   categories: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Category",
  //     },
  //   ],

  //   author: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "User",
  //     default: false,
  //   },

  //   comment: [
  //     {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Comment",
  //     },
  //   ],
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = { Blog };
