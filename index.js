const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const app2 = morgan()
morgan('tiny')
app.use(express.json())

const requestLogger = morgan((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
      ].join(' ')
})

app.use(requestLogger)

let persons = [
    {
        id: 1,
        name: 'AbortController',
        number: 123
    },
    {
        id: 2,
        name: 'AbortController',
        number: 1232
    },
    {
        id: 3,
        name: 'AbortController',
        number: 1233
    },
    {
        id: 4,
        name: 'AbortController',
        number: 1234
    }
    
]

app.get('/', (req, res) => {
    res.send('<h1>hello :d</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
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

    const person = {
        
        id: id,
        name: body.name,
        number: body.number
        
    }

    persons = persons.concat(person)

    console.log(person)

    res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
