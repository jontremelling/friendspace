const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  hideUserEmail: {
    type: Boolean,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  posts: {
    type: Array,
    required: true,
    default: []
  },
  contacts: {
    type: Array,
    required: true,
    default: []
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("user", UserSchema);