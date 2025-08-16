const mongoose = require ('mongoose')
const Review = require('./Review')
const Experience = require('./Experience')
const Trip = require('./Trip')
const cascadeDelete = require('../middlewares/cascadeDelete')
const fs = require('fs')
const path = require('path')

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        match: [/^[\p{L}0-9 _-]+$/u, 'Invalid characters detected. Use only letters, numbers, spaces, underscores, and dashes.'],
        required : true,
        index : true,
        unique : true
    },
    password : {
        type : String,
        minLength : 12,
        required : true
    },
    profilePicture : {
        type : String
    },
    email : {
        type : String,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/, 'Invalid email format.'],
        required : true,
        unique : true
    },
    location : {
        type : String,
        match: [/^[\p{L} .'-]+$/u, 'Invalid characters detected. Use only letters, spaces, apostrophes, and dashes.'],
        required : true,
    },
    role : {
        type : String,
        required : true,
        default : "user",
        enum : ["user", "admin"]
    },
    tags : {
        type : [{
            type : String,
            ref : 'Tag'
        }],
        required : true,
        validate: {
            validator: function(tags) {
                return tags.length >= 3
            },
            message: 'You must provide at least 3 tags.'
        }
    },
    wishlist : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Experience'
    }],
    friendlist : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }],
    trips : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Trip'
    }],
    reviews : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Review'
    }]
}, { strict: 'throw', timestamps: true })

//Hook pour supprimer tout ce qui a été créé par le user
UserSchema.pre('findOneAndDelete', async function (next) {
    const user = await this.model.findOne(this.getFilter())
    if (!user) return next()

    console.log(`Deleting user: ${user.username}`)

    // Supprimer toutes les reviews et expériences
    await Review.deleteMany({ createdBy: user._id })
    await Experience.deleteMany({ createdBy: user._id })
    await Trip.deleteMany({ createdBy: user._id })

    //Le supprimer des membres des trips
    cascadeDelete('members', ['Trip'])

    // Supprimer sa photo de profil
    if (user.profilePicture) {
        const filePath = path.join(__dirname, '..', 'uploads', 'profiles', user.profilePicture)
        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') 
                console.error(`Can't delete profile picture: ${err.message}`)
            
        })
    }

    next()
})

module.exports = mongoose.model('User', UserSchema)