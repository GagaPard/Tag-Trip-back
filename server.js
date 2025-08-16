require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const multer = require('multer')
const path = require('path')
const authRoutes = require('./routes/authRoutes')
const experienceRoutes = require('./routes/experienceRoutes')
const userRoutes = require('./routes/userRoutes')
const tagRoutes = require('./routes/tagRoutes')
const tripRoutes = require('./routes/tripRoutes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
require('./configs/passport')(passport)

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Database connected.'))
.catch((err) => console.error('Database connection error : ', err))

//Dossier pour les images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/tagtrip/auth', authRoutes)

//Authentification nécessaire à partir d'ici
app.use(passport.authenticate('jwt', { session: false }))

app.use('/tagtrip/user', userRoutes)
app.use('/tagtrip/experiences', experienceRoutes)
app.use('/tagtrip/tags', tagRoutes)
app.use('/tagtrip/trips', tripRoutes)

//Pour l'affichage des erreurs multer car envoyées avant de passer par le handler
app.use((err, req, res, next) => {
    if (err.type === 'NOT_VALID') {
      return res.status(400).json({ message: err.message, fields: err.fields || {} })
    }

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message })
    }

    if (err.type) {
      return ErrorManager.handleErrorResponse(err, res)
    }

    console.error(err)
    return res.status(500).json({ message: 'Internal Server Error.' })
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}.`))
