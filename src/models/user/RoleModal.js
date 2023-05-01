const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
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

const Role = mongoose.model("Role", roleSchema);

module.exports = { Role };
