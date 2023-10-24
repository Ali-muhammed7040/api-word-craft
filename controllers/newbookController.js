const NewBook = require("../Model/newbook");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Create Book
exports.createNewBook = async (req, res) => {
  const { title, author, project } = req.body;

  try {
    const response = await NewBook.create({ title, author, project });
    // console.log(response);
    res.json({ status: "true", response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: error.message });
  }
};

//update Book
exports.updateBook = async (req, res) => {
  try {
    const { bookId, updatedTitle, updatedAuthor, updatedProject } = req.body;

    const book = await NewBook.findById(bookId);

    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Book not found" });
    }

    if (updatedTitle) {
      book.title = updatedTitle;
    }

    if (updatedAuthor) {
      book.author = updatedAuthor;
    }

    if (updatedProject) {
      book.project = updatedProject;
    }

    const updatedBook = await book.save();

    res.json({
      status: "true",
      message: "Book updated successfully",
      response: updatedBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: error.message });
  }
};

//delete Book
exports.deleteBook = async (req, res) => {
  const bookId = req.params.bookId;
  console.log(bookId);

  try {
    const response = await NewBook.deleteOne({ _id: bookId });
    // console.log(response);
    res.json({ status: "true", response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: error.message });
  }
};

//copy Right
exports.copyRight = async (req, res) => {
  const { _id, year, penName } = req.body;
  try {
    const response = await NewBook.findOneAndUpdate(
      { _id },
      { $push: { copyright: { year, penName } } },
      { new: true }
    );
    if (response) {
      res.json({ status: "true", response });
    } else {
      res.status(404).json({ status: "error", error: "Document not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.addChapter = async (req, res) => {
  const { _id, chaptername, chapterbody } = req.body;

  try {
    const existingBook = await NewBook.findById(_id);

    if (existingBook) {
      const chapterExists = existingBook.chapters.some(
        (chapter) =>
          chapter.chaptername === chaptername &&
          chapter.chapterbody === chapterbody
      );

      if (!chapterExists) {
        existingBook.chapters.push({
          chaptername,
          chapterbody,
        });

        const response = await existingBook.save();

        res.json({ status: "true", response });
      } else {
        res.json({
          status: "false",
          error: "Chapter with the same title and body already exists",
        });
      }
    } else {
      res.status(404).json({ status: "error", error: "Document not found" });
    }
  } catch (error) {
    console.error("err", error);
    res.status(500).json({ status: "error", error: error.message });
  }
};

// Update chapter
exports.updateChapter = async (req, res) => {
  try {
    const { bookId, chapterId, updatedChapterName, updatedChapterBody } =
      req.body;

    const book = await NewBook.findById(bookId);

    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Book not found" });
    }

    const chapter = book.chapters.id(chapterId);

    if (!chapter) {
      return res
        .status(404)
        .json({ status: "error", message: "Chapter not found" });
    }

    chapter.chaptername = updatedChapterName;
    chapter.chapterbody = updatedChapterBody;

    const updatedBook = await book.save();

    res.json({
      status: "true",
      message: "Chapter updated successfully",
      response: updatedBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: error.message });
  }
};

// Add subchapter
exports.addSubChapter = async (req, res) => {
  try {
    const { chapterId, subchaptertitle, subchapterbody } = req.body;

    const existingChapter = await NewBook.findOneAndUpdate(
      { "chapters._id": chapterId },
      {
        $push: {
          "chapters.$.subchapters": { subchaptertitle, subchapterbody },
        },
      },
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
};

// Update Subchapter
exports.updateSubChapter = async (req, res) => {
  try {
    const {
      bookId,
      chapterId,
      subchapterId,
      updatedSubChapterTitle,
      updatedSubChapterBody,
    } = req.body;

    const book = await NewBook.findById(bookId);

    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Book not found" });
    }

    const chapter = book.chapters.id(chapterId);

    if (!chapter) {
      return res
        .status(404)
        .json({ status: "error", message: "Chapter not found" });
    }

    const subchapter = chapter.subchapters.id(subchapterId);

    if (!subchapter) {
      return res
        .status(404)
        .json({ status: "error", message: "Subchapter not found" });
    }

    subchapter.subchaptertitle = updatedSubChapterTitle;
    subchapter.subchapterbody = updatedSubChapterBody;

    const updatedBook = await book.save();

    res.json({
      status: "true",
      message: "Subchapter updated successfully",
      response: updatedBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: error.message });
  }
};

//delete Chapter
exports.deleteChapter = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.bookId); // Create ObjectId instance
    const chapterId = new ObjectId(req.params.chapterId); // Create ObjectId instance

    // Find the document by chapterId
    const book = await NewBook.findById(bookId);

    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Book not found" });
    }

    // Find the index of the chapter to be removed
    const chapterIndex = book.chapters.findIndex((chapter) =>
      chapter._id.equals(chapterId)
    );

    if (chapterIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "Chapter not found" });
    }

    // Remove the chapter from the chapters array
    book.chapters.splice(chapterIndex, 1);

    // Save the updated document
    const result = await book.save();

    res.json({
      status: "true",
      message: "Chapter deleted successfully",
      response: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: error.message });
  }
};

//delete SubChapter
exports.deleteSubChapter = async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.bookId); // Create ObjectId instance
    const subchapterId = new ObjectId(req.params.subchapterId);

    // Find the document by chapterId
    const book = await NewBook.findById(bookId);

    if (!book) {
      return res
        .status(404)
        .json({ status: "error", message: "Book not found" });
    }

    // Find the chapter containing the subchapter
    const chapter = book.chapters.find((chapter) =>
      chapter.subchapters.some((subchapter) =>
        subchapter._id.equals(subchapterId)
      )
    );

    if (!chapter) {
      return res
        .status(404)
        .json({ status: "error", message: "Chapter not found" });
    }

    // Remove the subchapter from the chapter's subchapters array
    const subchapterIndex = chapter.subchapters.findIndex((subchapter) =>
      subchapter._id.equals(subchapterId)
    );

    if (subchapterIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "Subchapter not found" });
    }

    chapter.subchapters.splice(subchapterIndex, 1);

    // Save the updated document
    const result = await book.save();

    res.json({
      status: "true",
      message: "Subchapter deleted successfully",
      response: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: error.message });
  }
};

//get Chapter
exports.getChapters = async (req, res) => {
  const userId = req.query.id;
  try {
    const response = await NewBook.findOne({ _id: userId }, { chapters: 1 });
    res.json({ status: "true", response });
  } catch (error) {
    console.error("err", error);
    res.status(500).json({ status: "error", error: error.message });
  }
};

//get single book or All Books
exports.getBookById = async (req, res) => {
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
};
