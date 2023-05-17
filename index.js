require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

app.get('/api/persons', (request, response)=>{
  console.log('inside GET request..');
    Person.find({}).then(people=> {
      response.json(people)
    })
    
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

  const person = new Person({
    name,
    number
  })

    person.save().then(savedPerson=> {
    console.log(`added ${savedPerson.name} number ${savedPerson.number} to phone book`)
    response.json(savedPerson)
})
  
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

app.delete('/api/persons/:id', (request, response, next)=>{
  console.log('delete request...');
  Person.findByIdAndRemove(request.params.id).then(result => {
    response.status(204).end()
  }).catch(error=>{
    console.log(error)
    return next(error)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})