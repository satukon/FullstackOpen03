import React from 'react';

export const FilterForm = (props) => {
    const {filterInput, handleFilterInputChange} = props;
  
    return (
      <form>
      <input value={filterInput} onChange={handleFilterInputChange} />
      </form>
    );
  };
  
  export const PersonForm = (props) => {
    const {newName, newNumber, handleNameChange, handleNumChange, handeAddPerson} = props;
  
    return (
      <div>
        <form onSubmit={handeAddPerson}>
        <p> name: <input value={newName} onChange={handleNameChange} /> </p>
        <p> number: <input value={newNumber} onChange={handleNumChange} /> </p>
        <p> <button type="submit">add</button> </p>
        </form>
      </div>
    );
  };
  
  export const Persons = (props) => {
    const { persons, filterInput, handleDelete } = props;
  
    const filteredPersons = persons.filter((person) =>
      person.name.toLowerCase().includes(filterInput.toLowerCase())
    );
  
    return (
      <div>
        {filteredPersons.map((person) => (
          <Person key={person.id} person={person} handleDeletePerson={handleDelete} />
        ))}
      </div>
    );
  };
  
  export const Person = (props) => {
    const {person, handleDeletePerson} = props;
  
    return (
        <p> {person.name} {person.number} <button onClick={() => handleDeletePerson(person.id, person.name)}>Delete</button></p>
    );
  };

  export const Message = (props) => {
    const { message, isError } = props;
  
    if (message === null) {
      return null;
    }
    if (isError === true) {
      return <div className="errorMessage">{message}</div>;
    } else {
      return <div className="message">{message}</div>;
    }
  };

  export default Persons;