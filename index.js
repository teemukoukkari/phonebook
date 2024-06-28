require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.static('frontend/build'))
app.use(express.json())
app.use(cors())

morgan.token('json', (req) => JSON.stringify(req.body))
morgan.token('clength', (req) => req.get('content-length'))
app.use(morgan(':method :url :status :clength :total-time[3]ms :json'))

app.get('/health', (_, res) => {
    res.send('ok')
})

app.get('/info', (req, res, next) => {
    Person.countDocuments({})
        .then(result => {
            res.send(`Phonebook has info for ${result} people<br>${new Date().toString()}`)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if(person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then((deleted) => {
            if(deleted) {
                res.status(204).end()
            } else {
                res.status(404).send({ error: 'person not found' })
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))

})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
    console.error(err.message)

    if(err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if(err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
    }

    next(err)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})