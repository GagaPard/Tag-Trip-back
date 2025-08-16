const Review = require('../schemas/Review')

const ErrorManager = require('../utils/error')

module.exports.addOneReview = async function (payload, options = null) {
    try {
        let newReview = new Review(payload)
        let save = await newReview.save()
        return save
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.findOneReviewById = async function (id, options = null) {
    try {
        let finded = await Review.findById(id)
        if (options && options.error_not_found && !finded) {
            // Erreur personnalisée si demandé
            throw { type: 'NOT_FOUND', message: 'Review not found.' }
        }
        return finded
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

/*
Appeler la fonction :
    await deleteOneReviewById(reviewId, {
        user: req.user,
        error_not_found: true
    })
*/

module.exports.deleteOneReviewById = async function (id, options = null) {
    try {
        const review = await Review.findById(id)
        if (options && options.error_not_found && !review) {
            throw { type: 'NOT_FOUND', message: 'Review not found.' }
        }
        const user = options?.user
        if (!user || (review.createdBy.toString() !== user._id.toString() && user.role !== 'admin')) {
            throw { type: 'FORBIDDEN', message: 'You are not authorized to delete this review.' }
        }
        let deleted = await Review.findOneAndDelete( { _id: id } )
        return deleted
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updateOneReviewById = async function (id, update, options = null) {
    try {
        const review = await Review.findById(id)
        if (options && options.error_not_found && !review) {
            throw { type: 'NOT_FOUND', message: 'Review not found.' }
        }
        const user = options?.user
        if (!user || (review.createdBy.toString() !== user._id.toString() && user.role !== 'admin')) {
            throw { type: 'FORBIDDEN', message: 'You are not authorized to update this review.' }
        }
        let updated = await Review.findByIdAndUpdate(id, update, { returnDocument: 'after', runValidators: true })
        return updated
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updatePictures = async function (id, files) {
    try {
        const review = await Review.findById(id)
        if (!review) {
            throw { type: 'NOT_FOUND', message: 'Review not found.' }
        }

        // Supprimer toutes les anciennes photos
        if (Array.isArray(review.pictures) && review.pictures.length > 0) {
            review.pictures.forEach(picture => {
                const oldPath = path.join(__dirname, '..', 'uploads', 'reviews', picture)
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath)
                }
            })
        }

        // Enregistrer les nouvelles photos
        const filenames = files.map(file => file.filename)
        experience.pictures = filenames

        await review.save()
        return review
    } catch (err) {
        throw ErrorManager.parsingError(err)
    }
}