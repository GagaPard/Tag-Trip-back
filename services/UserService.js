const User = require('../schemas/User')
const path = require('path')
const fs = require('fs')

module.exports.addOneUser = async function (payload, options = null) {
    try {
        let newUser = new User(payload)
        let save = await newUser.save()
        return save
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.findOneUserById = async function (id, options = null) {
    try {
        let finded = await User.findById(id)
        if (options && options.error_not_found && !finded) {
            // Erreur personnalisée si demandé
            throw { type: 'NOT_FOUND', message: 'User not found.' }
        }
        return finded
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.findOneUserByUsername = async function (username, options = null) {
    try {
        let finded = await User.findOne({ username })
        if (options && options.error_not_found && !finded) {
            // Erreur personnalisée si demandé
            throw { type: 'NOT_FOUND', message: 'User not found.' }
        }
        return finded
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.deleteOneUserById = async function (id, options = null) {
    try {
        let deleted = await User.findOneAndDelete( {_id : id} )
        if (options && options.error_not_found && !deleted) {
            throw { type: 'NOT_FOUND', message: 'User not found.' }
        }
        return deleted
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.deleteOneUserByUsername = async function (username, options = null) {
    try {
        let deleted = await User.findOneAndDelete({ username })
        if (options && options.error_not_found && !deleted) {
            throw { type: 'NOT_FOUND', message: 'User not found.' }
        }
        return deleted
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updateOneUserById = async function (id, update, options = null) {
    try {
        let updated = await User.findByIdAndUpdate(id, update, { returnDocument: 'after', runValidators: true })
        if (options && options.error_not_found && !updated) {
            throw { type: 'NOT_FOUND', message: 'User not found.' }
        }
        return updated
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updateOneUserByUsername = async function (username, update, options = null) {
    try {
        let updated = await User.findOneAndUpdate({ username }, update, { returnDocument: 'after', runValidators: true })
        if (options && options.error_not_found && !updated) {
            throw { type: 'NOT_FOUND', message: 'User not found.' }
        }
        return updated
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updateProfilePicture = async function (id, file) {
    try {
        const user = await User.findById(id)
        if (!user) {
            throw { type: 'NOT_FOUND', message: 'User not found.' }
        }

        //Supprimer l’ancienne photo si elle existe
        if (user.profilePicture) {
            const oldPath = path.join(__dirname, '..', 'uploads', 'profiles', user.profilePicture)
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath)
            }
        }

        user.profilePicture = file.filename
        await user.save()

        return user
    } catch (err) {
        throw ErrorManager.parsingError(err)
    }
}

module.exports.addToFriendlist = async function (userId, friendId, options = null) {
    try {
        const user = await User.findById(userId)

        if (!user) {
            if (options && options.error_not_found) {
                throw { type: 'NOT_FOUND', message: 'User not found.' }
            } else {
                return null
            }
        }

        if (user.friendlist.some(id => id.toString() === friendId.toString())) {
            throw { type: 'DUPLICATE', message: "The friend is already in the friendlist." }
        }

        user.friendlist.push(friendId)
        await user.save()

        return user
    } catch (err) {
        throw ErrorManager.parsingError(err)
    }
}

module.exports.removeFromFriendlist = async function (userId, friendId, options = null) {
    try {
        const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { friendlist: friendId } },
        { new: true }
        )

        if (!user) {
            if (options && options.error_not_found) {
                throw { type: 'NOT_FOUND', message: 'User not found.' }
            } else {
                return null
            }
        }

        return user
    } catch (err) {
        throw ErrorManager.parsingError(err)
    }
}

module.exports.addToWishlist = async function (userId, experienceId, options = null) {
    try {
        const user = await User.findById(userId)

    if (!user) {
        if (options && options.error_not_found) {
            throw { type: 'NOT_FOUND', message: 'User not found.' }
        } else {
            return null
        }
    }
    
    if (user.wishlist.some(id => id.toString() === experienceId.toString())) {
        throw { type: 'DUPLICATE', message: 'The experience is already in the wishlist.' }
    }

    user.wishlist.push(experienceId)
    await user.save()

    return user
    } catch (err) {
        throw ErrorManager.parsingError(err)
    }
}

module.exports.removeFromWishlist = async function (userId, experienceId, options = null) {
    try {
        const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { wishlist: experienceId } },
        { new: true }
        )

        if (!user) {
            if (options && options.error_not_found) {
                throw { type: 'NOT_FOUND', message: 'User not found.' }
            } else {
                return null
            }
        }

        return user
    } catch (err) {
        throw ErrorManager.parsingError(err)
    }
}