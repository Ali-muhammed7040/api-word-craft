const NewBook = require('../Model/newbook');

exports.createNewBook = async (req, res) => {
    const { title, author, project } = req.body;
  
    try {
      const response = await NewBook.create({ title, author, project });
      console.log(response);
      res.json({ status: "true", response });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", error: error.message });
    }
  }

  exports.copyRight = async (req, res) => {
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
      res.status(500).json({ status: "error", error: error.message });
    }
  }
  
  exports.addChapter =  async (req, res) => {
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
  }


exports.getChapters = async(req,res)=>{
    const userId = req.query.id;
    try {
      const response = await NewBook.findOne({ "_id": userId }, { "chapters": 1 })
       res.json({ status: "true", response });
    } catch (error) {
      console.error("err", error);
      res.status(500).json({ status: "error", error: error.message });
    }
  }

  exports.getBookById =  async (req, res) => {
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
  }