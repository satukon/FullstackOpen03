require('dotenv').config()

const Contact = require('./models/person')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))


//morgan
morgan.token('requestData', (req) => {
  return JSON.stringify(req.body)
})

const customLogFormat = ':method :url :status :res[content-length] - :response-time ms :requestData'
app.use(morgan(customLogFormat, { stream: { write: (message) => console.log(message.trim()) } }))

//info sivu
app.get('/api/info', (response, next) => {
  const currentTime = new Date().toString()
  Contact.find({})
    .then(persons => {
      response.send('Phonebook has info for ' + persons.length + ' people <p>' + currentTime)
    })
    .catch(error => next(error))
})

//kontaktien haku
app.get('/api/persons', (reguest, response, next) => {
  Contact.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

//kontaktin haku id:llä
app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//uuden kontaktin lisääminen
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const contact = new Contact({
    name: body.name,
    number: body.number,
  })

  contact.save()
    .then(savedContact => {
      response.json(savedContact)
    })
    .catch(error => next(error))
})

//kontaktin poisto
app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Contact.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error))
})


// error handling middlewares
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)


//serverin käynnistys ja kuuntelu
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})