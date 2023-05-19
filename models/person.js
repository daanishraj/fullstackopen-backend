const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to URL', url);

mongoose.connect(url).then(result => {
  console.log('connected to MongoDB:');
}).catch(error=>{
  console.log('error connecting to MongoDBL:', error.message);
})

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: true,
    },
    number: {
      type: String,
      minLength: 9,
      validate: {
        validator: (v)=> {
          return /[0-9]{2,3}-[0-9]+/.test(v)
        },
        message: (props) => `${props.value} is not a valid number!`
      },
      required: [true, 'User phone number is required']
    }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)