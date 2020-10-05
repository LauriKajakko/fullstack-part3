
require('dotenv').config()
const bodyParser = require('body-parser')
const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
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

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
}) 

app.get('/info', (req, res) => {
    const date = new Date()
    const today = date.toUTCString()
    
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
              <p>${today}</p>`)
    
})

app.post('/api/persons', (req, res) => {
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

    persons = persons.concat(person)

    console.log(person)

})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})


