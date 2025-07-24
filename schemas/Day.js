const mongoose = require ('mongoose')

const DaySchema = new mongoose.Schema({
    date : {
        type : Date,
        required : true,
        unique : true
    },
    trip : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Trip'
    },
    experiences : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Experience'
    }],
}, { timestamps: true })

module.exports = DaySchema