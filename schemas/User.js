const mongoose = require ('mongoose')

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
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
        required : true,
        unique : true
    },
    location : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        required : true,
        default : "user",
        enum : ["user", "admin"]
    },
    tags : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Tag'
    }],
    wishlist : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Wishlist'
    },
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
}, { timestamps: true }) 

module.exports = mongoose.model('User', UserSchema)