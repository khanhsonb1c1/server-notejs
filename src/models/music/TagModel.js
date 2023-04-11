const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  updated_at: {
    type: Number,
    default: Math.round(+new Date() / 1000),
    required: true,
  },
});

const Tag = mongoose.model("Tag", TagSchema);

module.exports = { Tag };
