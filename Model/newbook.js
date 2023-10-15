const mongoose = require("mongoose");

const NewBookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  project: { type: String, required: true },
  date: {
    type: Number,
    default: Date.now,
  },
  chapter: [
    {
      title: { type: String },
      body: { type: String },
      subchapter: [
        {
          title: { type: String },
          body: { type: String },
        },
      ],
    },
  ],
});
const model = mongoose.model("NewBookModel", NewBookSchema);

module.exports = model;
