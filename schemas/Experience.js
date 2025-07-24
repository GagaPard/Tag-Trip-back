const mongoose = require('mongoose')

const ExperienceSchema = new mongoose.SchemaType({
    name : {
        type : String,
        required : true,
        index : true,
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    experienceCategory : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ExperienceCategory'
    },
    tags : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tag'
    }],
    displayedTags : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tag'
    }],
    pictures : [{
        type : String
    }],
    about : {
        type : String,
        required : true
    },
    whatToExpect : [{
        type : String,
        required : true
    }],
    highlight : [{
        type : String,
        required : true
    }],
    adress : {
        lineOne : {
            type : String,
            required : true
        },
        postCode : {
            type : Number,
            required : true
        },
        city : {
            type : String,
            required : true
        },
        country : {
            type : String,
            required : true
        }
    },
    price : {
        type : Number,
        min : 0,
        required : true
    },
    ageMinimum : {
        type : Number,
        min : 0,
        default : 0,
        required : true
    },
    groupMaximum : {
        type : Number,
        min : 1,
    },
    openingHour : {
        type : String,
        required : true
    },
    closingHour : {
        type : String,
        required : true
    },
    durationInMinutes : {
        type : Number
    },
    languages : [{
        type : String,
        required : true
    }],
    url : {
        type : String,
        required : true
    },
    reviews : [{
        type : mongoose.Schema.Types.ObjectId
    }]
}, { timestamps : true })

module.exports = ExperienceSchema