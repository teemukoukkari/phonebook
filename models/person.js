const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log(`Connecting to ${url}`)
mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB: ', error.message)
    })

const regex = new RegExp('[0-9]{2}[0-9]?-[0-9]*$')
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: (v) => regex.test(v)
        },
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)