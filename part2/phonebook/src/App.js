import { useState } from 'react';

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [personsToShow, setPersonsToShow] = useState(persons);

  const addPerson = (event) => {
    event.preventDefault();
    
    persons.forEach(person => {
      if (person.name === newName) {
        alert(`${newName} is already added to phonebook`);
      } else {
        const personObject = {
          name: newName,
          number: newNumber
        }

        const newPersons = persons.concat(personObject);

        setPersons(newPersons);
        setPersonsToShow(newPersons);

        setNewName('');
        setNewNumber('');
      }
    });
  }

  const handleNewName = (event) => {
    setNewName(event.target.value);
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  }

  const handleSearch = (event) => {
    if (event.target.value !== '') {
      setPersonsToShow(persons.filter(person =>
        person.name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleSearch={handleSearch}/>
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        name={newName}
        number={newNumber}
        handleNewName={handleNewName}
        handleNewNumber={handleNewNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow}/>
    </div>
  );
}

export default App;
