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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
