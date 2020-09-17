const express = require('express')
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
