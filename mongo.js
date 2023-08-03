const mongoose = require('mongoose')

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url =
`mongodb+srv://satu:${password}@cluster0.6kuqfzt.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', personSchema)

if (process.argv.length === 3) {
    mongoose.connect(url)

    Contact.find({}).then(result => {
        console.log(`Phonebook:`)
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
}

else if (process.argv.length === 5) {

    mongoose.connect(url)

    const contact = new Contact({
        name: name,
        number: number,
    });

    contact.save().then(result => {
        console.log(`Added ${contact.name} ${contact.number} to phonebook.`)
            mongoose.connection.close()
    })
}
else {
    console.log('give password, contact name and contact number as arguments')
    process.exit(1)
}