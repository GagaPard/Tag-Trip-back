const mongoose = require ('mongoose')

const WishlistSchema = new mongoose.Schema({
    experiences : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Experience'
    }],
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},{ timestamps: true })

module.exports = WishlistSchema