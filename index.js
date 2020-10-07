
require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())



const PORT = process.env.PORT


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

morgan.token('postdata', (req, res) => {
  console.log(res)
  if(req.method==='POST'){
    return JSON.stringify(req.body)
  } else {
    return null
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'))

let persons = [
  {
    id: 1,
    name: 'AbortController',
    number: 123
  }
]

app.get('/', (req, res) => {
  res.send('<h1>hello :d</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      next(error)
    })
})

app.get('/info', (req, res) => {
  const date = new Date()
  const today = date.toUTCString()

  res.send(`<p>Phonebook has info for ${persons.length} people</p>
              <p>${today}</p>`)
})

app.post('/api/persons', (req, res, next) => {
  const min = Math.ceil(1)
  const max = Math.floor(1000000)
  const id = Math.floor(Math.random() * (max - min + 1) + min)

  const body = req.body

  if(!body.name || !body.number){
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  let exists = false
  persons.forEach(person => {
    if (person.name===body.name) exists=true
  })

  if(exists){
    return res.status(400).json({
      error: 'name already exists'
    })
  }

  const person = new Person({
    id: id,
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON())
  })
    .catch(error => next(error))

  persons = persons.concat(person)

  console.log(person)

})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      console.log(result._id)
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new:true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error:  'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)



