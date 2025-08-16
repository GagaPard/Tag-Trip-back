const mongoose = require ('mongoose')

const DaySchema = new mongoose.Schema({
    date : {
        type : Date,
        required : true,
        unique : true
    },
    experiences : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Experience'
    }],
}, { strict: 'throw', timestamps: true })

module.exports = DaySchema