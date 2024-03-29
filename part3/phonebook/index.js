require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('data', (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    return;
  } else {
    return JSON.stringify(req.body);
  }
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

app.get('/api/persons', (req, res) => {
  Person.find({}).then(person => {
    res.json(person);
  })
});

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const numOfPerons = persons.length;
    const dateTime = new Date();

    res.send(`<p>Phonebook has info for ${numOfPerons} people</p><p>${dateTime}</p>`);
  })
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).end();
    })
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(person => res.status(204).end())
    .catch(error => next(error));
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(error => next(error));
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => next(error));
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' });
}

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('App is running on http://localhost:3001')
});