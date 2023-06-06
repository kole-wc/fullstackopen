import { useState, useEffect } from 'react';

import personService from './services/persons';

import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons'
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [personsToShow, setPersonsToShow] = useState([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
        setPersonsToShow(initialPersons);
    })
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const isDuplicated = persons.some(person => person.name === newName); 
    
    if (isDuplicated) {
      if (window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )) {
        const person = persons.find(person => person.name === newName);
        const changedPerson = { ...person, number: newNumber };

        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            const newPersons = persons.map(existingPerson =>
              existingPerson.id !== person.id 
                ? existingPerson
                : returnedPerson
            );

            setPersons(newPersons);
            setPersonsToShow(newPersons);
            setStatus('updated');
            setMessage(
              `Updated ${newName}`
            )
            setTimeout(() => {
              setMessage('')
            }, 5000)
          })
          .catch(error => {
            setStatus('error');
            setMessage(
              `Information ${newName} has already been removed from server`
            )
            setTimeout(() => {
              setMessage('')
            }, 5000)
            setPersons(persons.filter(existingPerson =>
              existingPerson.id !== person.id
            ));
            setPersonsToShow(persons.filter(existingPerson =>
              existingPerson.id !== person.id
            ));
      })
        
      }
    } else {
      const personObject = {
      name: newName,
      number: newNumber
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setPersonsToShow(persons.concat(returnedPerson));
          setStatus('added');
          setMessage(
            `Added ${newName}`
          )
          setTimeout(() => {
            setMessage('')
          }, 5000)
        })
        .catch(error => {
          setMessage(
            `Added ${error.response.data.error}`
          )
          setTimeout(() => {
            setMessage('')
          }, 5000)
          console.log(error.response.data.error);
        })
    }

    setNewName('');
    setNewNumber('');
    setSearchValue('');
  }

  const handleNewName = (event) => {
    setNewName(event.target.value);
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  }

  const handleSearch = (event) => {
    setSearchValue(event.target.value);

    if (event.target.value !== '') {
      setPersonsToShow(persons.filter(person =>
        person.name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      ))
    } else {
      setPersonsToShow(persons);
    }
  }

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.deletePerson(person.id);

      const newPersons = persons
        .filter(existingPerson =>
          existingPerson.id !== person.id
      );
      
      setPersons(newPersons);
      setPersonsToShow(newPersons);
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        status={status}
        message={message}
      />
      <Filter
        searchValue={searchValue}
        handleSearch={handleSearch}
      />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        name={newName}
        number={newNumber}
        handleNewName={handleNewName}
        handleNewNumber={handleNewNumber}
      />
      <h2>Numbers</h2>
      <div>
        {personsToShow.map(person =>
        <Persons
        key={person.id}
        person={person}
        handleDelete={handleDelete}
        />
        )}
      </div>
    </div>
  );
}

export default App;
