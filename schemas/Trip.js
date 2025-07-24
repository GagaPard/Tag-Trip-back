const mongoose = require ('mongoose')

const TripSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    picture : {
        type : String,
    },
    location : {
        type : String,
        required : true
    },
    members : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    durationInDays : {
        type : Number,
        min : 1,
        default : 1,
        required : true
    },
    days : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Day'
    }],
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},{ timestamps: true }) 

module.exports = TripSchema