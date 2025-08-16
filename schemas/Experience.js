const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const Review = require('./Review')

const ExperienceSchema = new mongoose.Schema({
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
        type : String,
        required : true,
        enum : ['Restaurant', 'Activité', 'Hébergement']
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
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Review'
    }]
}, { strict: 'throw', timestamps : true })

//Hook pour supprimer tout ce qui est lié aux expériences
ExperienceSchema.pre('findOneAndDelete', async function (next) {
    const experience = await this.model.findOne(this.getFilter())
    if (!experience) return next()

    console.log(`Deleting experience: ${experience.name}`)

    // Supprimer toutes les reviews de l'expérience
    await Review.deleteMany({ experience: experience._id })

    //Supprimer les photos de l'expérience
    if (Array.isArray(experience.pictures)) {
        experience.pictures.forEach(picture => {
            const filePath = path.join(__dirname, '..', 'uploads', 'experiences', picture)
            fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error(`Can't delete picture "${picture}" of the experience: ${err.message}`)
                }
            })
        })
    }

    next()
})

module.exports = mongoose.model('Experience', ExperienceSchema)