const Persons = ({ person, handleDelete }) => {
    return (
      <>
        {person.name} {person.number}
        <button onClick={() => handleDelete(person)}>delete</button>
        <br/>
      </>
    );
}

export default Persons;