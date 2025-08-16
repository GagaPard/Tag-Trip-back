const mongoose = require ('mongoose')

const TagCategorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        index : true,
        unique : true,
        enum : ['Culture', 'Restauration', 'Hébergement', 'Paysages', 'Activités', 'Accessibilité']
    } 
}, { strict: 'throw', timestamps: true })

module.exports = TagCategorySchema