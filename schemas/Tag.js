const mongoose = require ('mongoose')

const TagSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        index : true,
        unique : true
    },
    tagCategory : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'TagCategory',
        required : true
    },
}, { timestamps: true })

module.exports = TagSchema
