require("dotenv").config();
const express = require("express");
const OPENAI = require("openai").OpenAI;
const cors = require("cors");
const mongoose = require("mongoose");
const NewBook = require("./Model/newbook");

mongoose.connect("mongodb://localhost:27017/AI-Editor");

const openai = new OPENAI();

const app = express();

app.use(express.json(), cors());
app.get("/", (req, res) => {
  res.send("hello world");
});
app.post("/paraphrasing", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt);
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `Give me best suggested paragraph and paraphrase it:"${prompt}"`,
      max_tokens: 1000,
      temperature: 1.5,
      n: 3,
    });
    return res.status(200).json({
      success: true,
      data: response.choices,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : "there was an issue on server",
    });
  }
});

app.post("/continuewriting", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log(prompt, "working with contine");
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `${prompt}continue writing provide me atleast two paragraph `,
      max_tokens: 1000,
    });

    console.log(response.choices[0].text);
    return res.status(200).json({
      success: true,
      data: response.choices[0].text,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : "there was an issue on server",
    });
  }
});

app.get("/demo", (req, res) => {
  res.json([
    {
      id: "001",
      name: "Smith",
      email: "smith@gmail.com",
    },
    {
      id: "002",
      name: "Sam",
      email: "sam@gmail.com",
    },
    {
      id: "003",
      name: "lily",
      email: "lily@gmail.com",
    },
  ]);
});

app.post("/createnewbook", async (req, res) => {
  const { title, author, project } = req.body;

  try {
    const response = await NewBook.create({ title, author, project });
    console.log(response);
    res.json({ status: "true", response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: error.message });
  }
});




app.post("/copyright", async (req, res) => {
  const { _id, year, penName } = req.body;
  try {
    const response = await NewBook.findOneAndUpdate(
      { _id },
      { $push: { copyright: { year, penName } } },
      { new: true }
    )
    if (response) {
      res.json({ status: "true", response });
    } else {
      res.status(404).json({ status: "error", error: "Document not found" });
    }
  }
  catch (error) {
    console.error(error);
  }
}
)


app.post("/addchapter", async (req, res) => {
  const { _id, chaptername, chapterbody, subchaptertitle, subchapterbody } = req.body;

  try {
    const existingBook = await NewBook.findById(_id);

    if (existingBook) {
      const chapterExists = existingBook.chapters.some(
        (chapter) =>
          chapter.chaptername === chaptername && chapter.chapterbody === chapterbody
      );

      if (!chapterExists) {
        existingBook.chapters.push({
          chaptername,
          chapterbody,
          subchapters: [{ subchaptertitle, subchapterbody }],
        });

        const response = await existingBook.save();

        res.json({ status: "true", response });
      } else {
        res.json({ status: "false", error: "Chapter with the same title and body already exists" });
      }
    } else {
      res.status(404).json({ status: "error", error: "Document not found" });
    }
  } catch (error) {
    console.error("err", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

app.get('/getchapters/:id?',async(req,res)=>{
  const userId = req.query.id;
  console.log(userId,'id')
  try {
    const response = await NewBook.findOne({ "_id": userId }, { "chapters": 1 })
    res.json({ status: "true", response });
  } catch (error) {
    console.log(error)
  }
  // res.send
})


app.get("/books/:id?", async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const books = await NewBook.findById(id);
      res.json({ status: true, books });
      console.log(books, "by id");
      return;
    }
    const books = await NewBook.find({});
    res.json({ status: "true", books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

const HTTP_PORT = process.env.PORT || 3001;

app.listen(HTTP_PORT, () => {
  console.log(`Sever listening on port http://localhost:${HTTP_PORT}`);
});
