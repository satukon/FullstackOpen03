import React, { useState, useEffect } from 'react';
import personsService from './services/persons'
import { FilterForm, PersonForm, Persons, Message } from './components/persons';

const App = () => {

  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterInput, setFilterFormText] = useState('');
  const [message, setNewMessage] = useState(null);
  const [isError, setIsError] = useState(null);

  //kontaktien lataaminen palvelimelta
  useEffect(() => {
    personsService
      .getAll()
      .then((response) => {
        setPersons(response.data);
      })
      .catch((error) => {
        setNewMessage(
          `Error loading contact informations.`
        )
        setIsError(true);
      });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterInputChange = (event) => {
    setFilterFormText(event.target.value);
  };

  // uuden kontaktin lisääminen
  const handeAddPerson = (event) => {
    event.preventDefault();

    // etsitään, löytyykö lisättävän kontaktin nimi jo puhelinluettelosta:
    const existingPerson = persons.find((person) => person.name === newName);

    // jos nimi löytyy jo puhelinluettelosta, kysytään halutaanko numero päivittää.
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook. Want to replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        
        personsService
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            setPersons(persons.map((person) => person.id === existingPerson.id ? response.data : person));
            setNewName('');
            setNewNumber('');

            //viesti käyttäjälle onnistuneesta päivityksestä
            setNewMessage(
              `Updated '${response.data.name}', new number is '${response.data.number}'.`
            )
            setIsError(false);
            setTimeout(() => {
              setNewMessage(null)
            }, 2500)
          })
          // virheen käsittely: viesti käyttäjälle epäonnistuneesta päivityksestä
          .catch((error) => {
            setNewMessage(
              `Information of '${newName}' has already been removed from the server.`
            )
            setIsError(true);
            setTimeout(() => {
              setNewMessage(null)
            }, 2500)
          });
      }
      // jos nimeä ei löydy puhelinluettelosta, lisätään uusi kontakti:
    } else {
      const newPerson = { name: newName, number: newNumber };
      personsService
        .create(newPerson)
        .then((response) => {
          setPersons(persons.concat(response.data));
          setNewName('');
          setNewNumber('');

          //viesti käyttäjälle onnistuneesta lisäyksestä:
          setNewMessage(
            `Added '${response.data.name}' to phonebook.`
          )
          setIsError(false);
          setTimeout(() => {
            setNewMessage(null)
          }, 2500)
        })
        //virheen käsittely: viesti käyttäjälle epäonnistuneesta lisäyksestä
        .catch((error) => {
          setNewMessage(
            `Error adding '${newName}' to the phonebook.`
          )
          setIsError(true);
          setTimeout(() => {
            setNewMessage(null)
          }, 2500)
        });
    }
  };

  // kontaktin poistaminen
  const handleDeletePerson = (id, name) => {
    if (window.confirm(`Do you really want to delete "${name}" ?`)) {
    personsService
      .delete(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id));

        // viesti käyttäjälle onnistuneesta poistosta
        setNewMessage(
          `Deleted '${name}' from phonebook.`
        )
        setIsError(false);
        setTimeout(() => {
          setNewMessage(null)
        }, 2500)
      })
      .catch((error) => {
          // virheen käsittely: viesti käyttäjälle epäonnistuneesta poistosta
          setNewMessage(
            `Error deleting '${name}' from phonebook. Information has already been removed from the server.`
          )
          setIsError(true);
          setTimeout(() => {
            setNewMessage(null)
          }, 2500)
      });
    }
  };

  return (
    <div>
      <h1>Phonebook app</h1>

      <Message
      message={message}
      isError={isError}
      />

      <h3>Filter contacts</h3>

      <FilterForm
      filterInput={filterInput}
      handleFilterInputChange={handleFilterInputChange}
      />

      <h3>Add a new contact</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumChange={handleNumChange}
        handeAddPerson={handeAddPerson}
      />

      <h3>Contacts</h3>

      <Persons
      persons={persons}
      filterInput={filterInput}
      handleDelete={handleDeletePerson} 
      />
    </div>
  );
};

export default App;