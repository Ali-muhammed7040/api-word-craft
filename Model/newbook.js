const mongoose = require ('mongoose')

const NewBookSchema = new mongoose.Schema({
    title: {type :String,required:true},
    author: {type :String,required:true},
    project: {type :String,required:true},
    date : {
        type: Number,
        default: Date.now
    }
})
const model = mongoose.model('NewBookModel',NewBookSchema)

module.exports = model