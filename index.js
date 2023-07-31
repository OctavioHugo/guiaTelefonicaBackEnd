const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())

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


let persons =  [
      { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
    ]
  
const generateId = () => (
  persons.length > 0
  ? Math.max(...persons.map(n => n.id)) + 1 
  : 0
)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
    })
    
app.get('/api/persons', (request, response) => {
response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
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
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!request.body.name) {
    return response.status(400).json({ 
      error: 'name is missing' 
    })
  }

  if (!request.body.number) {
    return response.status(400).json({ 
      error: 'number is missing' 
    })
  }

  if (persons.find(person => person.name === request.body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }
  
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})