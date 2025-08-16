const multer = require('multer')
const path = require('path')
const fs = require('fs')

function createUploader(folder, fields, maxSizeMB = 2) {  //(sous dossier, le type de fichier, taille du fichier max)
    const uploadDir = path.join(__dirname, '..', 'uploads', folder)
    fs.mkdirSync(uploadDir, { recursive: true })

    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),    //où on stocke le fichier
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase()   //l'extension du fichier
            const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}` //nom aléatoire
            cb(null, name)
        }
    })

    const fileFilter = (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']  //On vérifie le type MIME envoyé par le browser
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            const err = new Error("One or more files doesn't have a valid file type.")
            err.type = 'NOT_VALID'
            err.fields = { [file.fieldname]: 'Invalid file type. Only JPG, PNG, WEBP are allowed.' }
            return cb(err)
        }
    }

   // Middleware multer.fields()
    const multerUpload = multer({
        storage,
        fileFilter,
        limits: { fileSize: maxSizeMB * 1024 * 1024 }
    }).fields(fields)

    // Gestion des erreurs Unexpected File
    return (req, res, next) => {
        multerUpload(req, res, (err) => {
            if (err) {
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    const allowedFields = fields.map(field => field.name)
                    if (!allowedFields.includes(err.field)) {
                        err.type = 'NOT_VALID'
                        err.fields = {
                            [err.field]: `Field "${err.field}" is not allowed.`
                        }
                    } else {
                        const max = fields.find(field => field.name === err.field)?.maxCount
                        err.type = 'NOT_VALID'
                        err.fields = {
                            [err.field]: `Too many files for field "${err.field}". Maximum allowed is ${max}.`
                        }
                    }
                } else if (err.code === 'LIMIT_FILE_SIZE') {
                    err.type = 'NOT_VALID'
                    err.fields = {
                        file: `File is too large. Maximum size is ${maxSizeMB}MB.`
                    }
                }
                return next(err)
            }
            next()
        })
    }
}

module.exports = createUploader

/* Manière d'utiliser :
const uploadPP = pictureUploader('nom du sous dossier dans uploads', [ { name: 'nomduchamp', maxCount: nombredephotosmax } ], taille en mb)
*/