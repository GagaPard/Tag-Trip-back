const mongoose = require ('mongoose')

const ReviewSchema = new mongoose.Schema({
    title : {
        type : String,
        match: [/^[\p{L}0-9 _-]+$/u, 'Invalid characters detected. Use only letters, numbers, spaces, underscores, and dashes.'],
        required : true,
    },
    experience : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Experience',
        required : true,
        index : true,
    },
    grade : {
        type : Number,
        min : 1,
        max : 5,
        required : true
    },
    text : {
        type : String,
        match: [/^[\p{L}0-9 _-]+$/u, 'Invalid characters detected. Use only letters, numbers, spaces, underscores, and dashes.'],
        required : true
    },
    pictures : [{
        type : String
    }],
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
}, { _id : false })

//Hook pour supprimer les pictures
ReviewSchema.pre('findOneAndDelete', async function (next) {
    const review = await this.model.findOne(this.getFilter())
    if (!review) return next()

    console.log(`Deleting review: ${review.title}`)

    // Supprimer les photos de la review
    if (Array.isArray(review.pictures)) {
        review.pictures.forEach(pic => {
            const filePath = path.join(__dirname, '..', 'uploads', 'reviews', pic)
            fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error(`Can't delete picture "${pic}" of the review: ${err.message}`)
                }
            })
        })
    }

    next()
})

module.exports = mongoose.model('Review', ReviewSchema)