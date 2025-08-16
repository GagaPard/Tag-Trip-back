const mongoose = require ('mongoose')
const DaySchema = require ('./Day')

const TripSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        match: [/^[\p{L}0-9 _-]+$/u, 'Invalid characters detected. Use only letters, numbers, spaces, underscores, and dashes.'],
    },
    picture : {
        type : String,
    },
    location : {
        type : String,
        match: [/^[\p{L} .'-]+$/u, 'Invalid characters detected. Use only letters, spaces, apostrophes, and dashes.'],
        required : true
    },
    members : {
        type : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }],
        required : true,
        validate: {
            validator: function(members) {
                return members.length >= 1
            },
            message: 'The trip needs to have at least 1 member.'
        }
    },
    durationInDays : {
        type : Number,
        min : 1,
        default : 1,
        required : true
    },
    days : [DaySchema],
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},{ strict: 'throw', timestamps: true })

//Middleware pour qu'il y ai toujours le créateur dans les members
TripSchema.pre('save', function (next) {
    if (this.createdBy) {
        const creatorId = this.createdBy.toString()
        const membersIds = (this.members || []).map(member => member.toString())

        if (!membersIds.includes(creatorId)) {
        this.members = [...this.members || [], this.createdBy]
        }
    }
    next()
})

//Hook pour supprimer l'image
TripSchema.pre('findOneAndDelete', async function (next) {
    const trip = await this.model.findOne(this.getFilter())
    if (!trip) return next()

    console.log(`Deleting trip: ${trip.title}`)

    if (trip.picture) {
        const filePath = path.join(__dirname, '..', 'uploads', 'trips', trip.picture)
        fs.unlink(filePath, (err) => {
            if (err && err.code !== 'ENOENT') 
                console.error(`Can't delete picture: ${err.message}`)
            
        })
    }

    next()
})

module.exports = mongoose.model('Trip', TripSchema)