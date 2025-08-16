const mongoose = require ('mongoose')
const cascadeDelete = require('../middlewares/cascadeDelete')

const TagSchema = new mongoose.Schema({
    name : {
        type : String,
        match: [/^[\p{L}0-9 ]+$/u, 'Invalid characters detected. Use only letters, numbers and spaces.'],
        required : true,
        index : true,
        unique : true
    },
    tagCategory : {
        type : String,
        required : true,
        index : true,
        enum : ['Culture', 'Restauration', 'Hébergement', 'Paysages', 'Activités', 'Accessibilité']
    },
}, { strict: 'throw', timestamps: true })

TagSchema.pre('findOneAndDelete', cascadeDelete('tags', ['User'], ['Experience']))

module.exports = mongoose.model('Tag', TagSchema)
