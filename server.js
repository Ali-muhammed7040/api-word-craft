require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const openaiController = require("./controllers/openaiController");
const newbookController = require("./controllers/newbookController");

mongoose.connect("mongodb://localhost:27017/AI-Editor");
const app = express();

app.use(express.json(), cors());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/paraphrasing", openaiController.paraphrasing);
app.post("/continuewriting", openaiController.continueWriting);

app.post("/createnewbook", newbookController.createNewBook);
app.post("/updatebook", newbookController.updateBook);
app.delete("/deletebook/:bookId", newbookController.deleteBook);
app.get("/books/:id?", newbookController.getBookById);

app.post("/copyright", newbookController.copyRight);

app.post("/addchapter", newbookController.addChapter);
app.post("/updatechapter", newbookController.updateChapter);
app.delete(
  "/books/:bookId/chapters/:chapterId",
  newbookController.deleteChapter
);
app.get("/getchapters/:id?", newbookController.getChapters);

app.post("/addsubchapter", newbookController.addSubChapter);
app.post("/updatesubchapter", newbookController.updateSubChapter);
app.delete(
  "/books/:bookId/subchapters/:subchapterId",
  newbookController.deleteSubChapter
);

// Other routes and controllers

const HTTP_PORT = process.env.PORT || 3001 || 3003;
app.listen(HTTP_PORT, () => {
  console.log(`Server listening on port http://localhost:${HTTP_PORT}`);
});
