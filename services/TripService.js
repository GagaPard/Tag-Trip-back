const Trip = require('../schemas/Trip')

const ErrorManager = require('../utils/error')

module.exports.addOneTrip = async function (payload, options = null) {
    try {
        let newTrip = new Trip(payload)
        let save = await newTrip.save()
        return save
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.findOneTripById = async function (id, options = null) {
    try {
        let finded = await Trip.findById(id)
        if (options && options.error_not_found && !finded) {
            // Erreur personnalisée si demandé
            throw { type: 'NOT_FOUND', message: 'Trip not found.' }
        }
        return finded
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

/*
Appeler la fonction :
    await deleteOneTripById(tripId, {
        user: req.user,
        error_not_found: true
    })
*/

module.exports.deleteOneTripById = async function (id, options = null) {
    try {
        const trip = await Trip.findById(id)
        if (options && options.error_not_found && !trip) {
            throw { type: 'NOT_FOUND', message: 'Trip not found.' }
        }
        const user = options?.user
        if (!user || (trip.createdBy.toString() !== user._id.toString() && user.role !== 'admin')) {
            throw { type: 'FORBIDDEN', message: 'You are not authorized to delete this trip.' }
        }
        let deleted = await Trip.findOneAndDelete( { _id: id } )
        return deleted
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updateOneTripById = async function (id, update, options = null) {
    try {
        const trip = await Trip.findById(id)
        if (options && options.error_not_found && !trip) {
            throw { type: 'NOT_FOUND', message: 'Trip not found.' }
        }
        const user = options?.user
        if (!user || (trip.createdBy.toString() !== user._id.toString() && user.role !== 'admin')) {
            throw { type: 'FORBIDDEN', message: 'You are not authorized to update this trip.' }
        }
        let updated = await Trip.findByIdAndUpdate(id, update, { returnDocument: 'after', runValidators: true })
        return updated
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updatePicture = async function (id, file) {
    try {
        const trip = await Trip.findById(id)
        if (!trip) {
            throw { type: 'NOT_FOUND', message: 'User not found.' }
        }

        //Supprimer l’ancienne photo si elle existe
        if (trip.profilePicture) {
            const oldPath = path.join(__dirname, '..', 'uploads', 'trips', trip.profilePicture)
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath)
            }
        }

        trip.profilePicture = file.filename
        await trip.save()

        return trip
    } catch (err) {
        throw ErrorManager.parsingError(err)
    }
}