const NewBook = require('../Model/newbook');
const mongoose = require ('mongoose')
const { ObjectId } = mongoose.Types;

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
  
  // exports.addChapter =  async (req, res) => {
  //   const { _id, chaptername, chapterbody, subchaptertitle, subchapterbody } = req.body;
  
  //   try {
  //     const existingBook = await NewBook.findById(_id);
  
  //     if (existingBook) {
  //       const chapterExists = existingBook.chapters.some(
  //         (chapter) =>
  //           chapter.chaptername === chaptername && chapter.chapterbody === chapterbody
  //       );
  
  //       if (!chapterExists) {
  //         existingBook.chapters.push({
  //           chaptername,
  //           chapterbody,
  //           subchapters: [{ subchaptertitle, subchapterbody }],
  //         });
  
  //         const response = await existingBook.save();
  
  //         res.json({ status: "true", response });
  //       } else {
  //         res.json({ status: "false", error: "Chapter with the same title and body already exists" });
  //       }
  //     } else {
  //       res.status(404).json({ status: "error", error: "Document not found" });
  //     }
  //   } catch (error) {
  //     console.error("err", error);
  //     res.status(500).json({ status: "error", error: error.message });
  //   }
  // }
  exports.addChapter = async (req, res) => {
    const { _id, chaptername, chapterbody } = req.body;
  
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

  // Create a route for adding subChapters
  exports.addSubChapter = async (req, res) => {
    try {
      const { chapterId, subchaptertitle, subchapterbody } = req.body;
  
      const existingChapter = await NewBook.findOneAndUpdate(
        { 'chapters._id': chapterId },
        { $push: { 'chapters.$.subchapters': { subchaptertitle, subchapterbody } } },
        { new: true }
      );
  
      if (existingChapter) {
        res.json({ status: "true", response: existingChapter });
      } else {
        res.status(404).json({ status: "error", error: "Chapter not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", error: error.message });
    }
}
exports.removeSubChapter = async (req, res) => {
  try {
    const chapterId = new ObjectId(req.params.chapterId); // Create ObjectId instance
    const subchapterId = new ObjectId(req.params.subchapterId);

    // Find the document by chapterId
    const book = await NewBook.findById(chapterId);

    if (!book) {
      return res.status(404).json({ status: 'error', message: 'Book not found' });
    }

    // Find the chapter containing the subchapter
    const chapter = book.chapters.find((chapter) =>
      chapter.subchapters.some((subchapter) => subchapter._id.equals(subchapterId))
    );

    if (!chapter) {
      return res.status(404).json({ status: 'error', message: 'Chapter not found' });
    }

    // Remove the subchapter from the chapter's subchapters array
    const subchapterIndex = chapter.subchapters.findIndex((subchapter) => subchapter._id.equals(subchapterId));

    if (subchapterIndex === -1) {
      return res.status(404).json({ status: 'error', message: 'Subchapter not found' });
    }

    chapter.subchapters.splice(subchapterIndex, 1);

    // Save the updated document
    const result = await book.save();

    res.json({ status: 'true', message: 'Subchapter deleted successfully', response: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: error.message });
  }
}



// app.delete('/chapters/:chapterId/subchapters/:subchapterId', newbookController.removeSubChapter);


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