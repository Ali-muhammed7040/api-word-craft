const mongoose = require ('mongoose')

const AddChapterSchema = new mongoose.Schema({
    project: {type :String,required:true},
    text: {type :String,required:true},
    name: {type :String,required:true},
    subtitle: {type :String,required:true},
    date : {
        type: Number,
        default: Date.now
    },
   
})
const model = mongoose.model('AddChapterModel',AddChapterSchema)

module.exports = model

