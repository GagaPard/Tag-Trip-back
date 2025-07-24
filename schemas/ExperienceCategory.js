 const mongoose = require('mongoose')

 const ExperienceCategorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        enum : ['Restaurant', 'Activité', 'Hébergement'],
        unique : true
    }
 }, { timestamps : true})

 module.exports = ExperienceCategorySchema