const mongoose = require('mongoose')

const password = process.argv[2]

const url =
  `mongodb+srv://octaviobressan:${password}@guiatelefonica-db.qcanjvq.mongodb.net/phonebook?retryWrites=true&w=majority
`
const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)
  
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
} else if(process.argv.length === 3) {
    mongoose.connect(url)
    console.log("Phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
} else if(process.argv.length === 5) {
    mongoose.connect(url)
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}