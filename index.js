// imports
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')


// some middleware
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(requestLogger)



// some routes
app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})


app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === parseInt(id))
    if (note) {
        response.json(note)
    }
    else {
        response.status(404).end()
    }
})


app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== parseInt(id))
    console.log(notes);

    response.status(204).end()
})


const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(note => Number(note.id)))
        : 0
    return String(maxId + 1)
}


app.post('/api/notes', (request, response) => {

    const body = request.body

    if (!body.content) {
        return response.status(400).json({ error: 'content missing' })
    }

    const note = {
        id: generateId(),
        content: body.content,
        important: Boolean(body.important) || false
    }

    notes = notes.concat(note)

    response.json(note)
})



// unknown page middleware
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


// make app listen to port
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

