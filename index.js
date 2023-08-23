require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(cors())
app.use(express.static('build'))




const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

/*creo que esto iria aca*/ 
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

morgan.token('body', (request, response) =>request.method === 'POST' ? JSON.stringify(request.body) : '')

app.use(express.json())
app.use(morgan((tokens, request, response) => [
  tokens.method(request, response),
  tokens.url(request, response),
  tokens.status(request, response),
  tokens.res(request, response, 'content-length'), '-',tokens['response-time'](request, response), 'ms', tokens.body(request, response)
].join('')))

app.use(requestLogger)


  


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
    })
    
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})
 
app.get('/info', (request, response) => {
  const responseText = `
  <p>Ponebook has info for ${persons.length} people</p>
  <p>${new Date}</p>
  `
  response.send(responseText)
})  

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = Person.filter(person => person.id !== id)

  response.status(204).end()
})



app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})