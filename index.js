const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response)=>{
    response.json(persons)
})

app.post('/api/persons', (request, response)=>{
  const {name, number} = request.body

  if (!name.trim()){
    return response.status(400).json({error: 'Name is missing!'})
  }

  if (!number.trim()){
    response.status(400).json({error: 'Number is missing!'})
    return
  }

  const duplicate = persons.find(person => {
    return person.name.toLowerCase()===name.toLowerCase()
  })

  if (duplicate) {
    return response.status(400).json({error: 'Name already exists in phonebook!'})
  }

  const id = Math.floor(Math.random()*1000000)
  const person = {
    id,
    name,
    number
  }
  persons = persons.concat(person)
  response.json(person)
})

app.get('/info', (request, response)=>{
    const message = `Phonebook has info for ${persons.length} people`
    response.send(`<p>${message}</p><br/><p>${Date()}</p>`)
})

app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    const person = persons.find(person=> person.id===id)
    if (!person) {
        response.status(404).end()
        return
    }
    response.json(`${person.name} ${person.number}`)
})

app.delete('/api/persons/:id', (request, response)=>{
  const id = Number(request.params.id)
  persons = persons.filter(person=>person.id!==id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})