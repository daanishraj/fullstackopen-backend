const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('pass password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.iploxgm.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// only password is passed
if (process.argv.length <4) {
// fetch and print all the entries in the phonebook
  console.log('phonebook: ')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else {
  console.log('Create an entry in DB..')

  // Add entry to phonebook
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number
  })

  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phone book`)
    mongoose.connection.close()
  }).catch(err => {
    console.log('save failed')
    console.log(`The error is: ${err}`)
  })
}

