const mongoose = require ('mongoose')

const NewBookSchema = new mongoose.Schema({
    title: {type :String,required:true},
    author: {type :String,required:true},
    project: {type :String,required:true},
    copyright: [],
    date : {
        type: Number,
        default: Date.now
    },
    chapters: [
        {
          chaptername: String,
          chapterbody: String,
          subchapters: [
            {
              subchaptertitle: String,
              subchapterbody: String,
            }
          ]
        }
      ]
   
})
const model = mongoose.model('NewBookModel',NewBookSchema)

module.exports = model