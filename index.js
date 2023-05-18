require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpointHandler = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (error, request, response, next ) => {
  console.error(error)
  console.error(error.message)

  if (error.name=== 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  }

  next(error)
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

app.get('/api/persons', (request, response)=>{
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

app.get('/info', async (request, response)=>{
    const peopleCount = await Person.countDocuments({}).exec()
    const message = `Phonebook has info for ${peopleCount} people`
    response.send(`<p>${message}</p><br/><p>${Date()}</p>`)
})

app.get('/api/persons/:id', (request, response, next)=>{
  console.log('GET specific person...');
    Person.findById(request.params.id)
    .then(person => {
      console.log(person);
      if (person) {
        response.status(200).json(person)
      }
        response.status(404).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next)=>{
  const {name, number}= request.body
  const person = {name, number}
 
  Person.findByIdAndUpdate(request.params.id, person, {new:true})
  .then(updatedPerson => {
    response.status(200).json(updatedPerson)
  })
  .catch(error=>next(error))
})

app.delete('/api/persons/:id', (request, response, next)=>{
  Person.findByIdAndRemove(request.params.id).then(result => {
    response.status(204).end()
  }).catch(error=>{
    return next(error)
  })
})

app.use(unknownEndpointHandler)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})