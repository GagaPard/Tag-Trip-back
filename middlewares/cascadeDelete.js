const mongoose = require('mongoose')

//Fonction pour faire des middlewares de delete en cascade
//fields : champ qui contient la référence à supprimer, model le model qui a le champ, et isArray à true si l'ID est contenu dans un tableau
module.exports = function cascadeDelete(field, models, isArray = true) {
    return async function (next) {
        try {

            const doc = await this.model.findOne(this.getFilter())

            if (!doc) 
                return next()

            const id = doc._id

            //On boucle sur toutes les itérations du model pour trouver l'ID à supprimer
            for (let modelName of models) {

                if (isArray) {
                    await mongoose.model(modelName).updateMany(
                    { [field]: id },
                    { $pull: { [field]: id } }
                    )
                } else {
                    await mongoose.model(modelName).updateMany(
                    { [field]: id },
                    { $unset: { [field]: "" } }
                    )
                }
            }

            next()
        } catch (err) {
            next(err)
        }
    }
}