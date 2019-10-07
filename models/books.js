const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
  },
  comments: {
    type: Array,
    default: [],
  },
  commentCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.models.book ||  mongoose.model('book', bookSchema);