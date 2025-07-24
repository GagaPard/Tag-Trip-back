const mongoose = require ('mongoose')

const ReviewSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    experience : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Experience',
        required : true,
        index : true,
    },
    grade : {
        type : Number,
        min : 1,
        max : 5,
        required : true
    },
    text : {
        type : String,
        required : true
    },
    pictures : [{
        type : string
    }],
    createdBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
    }
}, { timestamps: true })

module.exports = ReviewSchema