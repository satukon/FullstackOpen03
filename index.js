const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(express.json());
app.use(cors());

morgan.token('requestData', (req, res) => {
    return JSON.stringify(req.body);
});

const customLogFormat = ':method :url :status :res[content-length] - :response-time ms :requestData';
app.use(morgan(customLogFormat, { stream: { write: (message) => console.log(message.trim()) } }));

let persons = [
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
      },
      {
        "name": "Elviira Kana",
        "number": "040 1234567",
        "id": 5
      },
      {
        "name": "Pekka Kana",
        "number": "040 7654321",
        "id": 6
      }
    ]

    app.get('/', (req, res) => {
        res.send('<h1>Hello World!</h1>')
     })
      
    app.get('/info', (req, res) => {
        const currentTime = new Date().toString();
        res.send('Phonebook has info for ' + persons.length + ' people <p>' + currentTime)
    })

    app.get('/api/persons', (req, res) => {
        res.json(persons)
    })

    app.get('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        console.log(id)
        const person = persons.find(person => person.id === id)

        if (person) {
            response.json(person);
            console.log(person);
        }
        else {
            response.status(404).json({ error: 'Person not found' });
            console.log('error: Person not found');
        }
    });
    
    app.delete('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    })
          
    app.post('/api/persons', (request, response) => {
        const body = request.body
        const personExists = persons.find((person) => person.name === body.name);
          
        if (!body.name || !body.number) {
            return response.status(400).json({error: 'name or number missing'})
        }

        if (personExists) {
            return response.status(400).json({ error: 'name must be unique' });
        }
        
        const person = {
            name: body.name,
            number: body.number,
            id: generateId()
        }
          
        persons = persons.concat(person)
        response.json(person)
    })

    const generateId = () => {
        const maxId = persons.length > 0
            ? Math.max(...persons.map(n => n.id))
            : 0
        return maxId + 1
    }

    const PORT = process.env.PORT || 3001
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
    })