const PersonForm = props => (
  <form onSubmit={props.handleSubmit}>
    <table>
      <tbody>
        <tr>
          <td>Name:</td>
          <td><input value={props.newName} onChange={props.handleNameChange}/></td>
        </tr>
        <tr>
          <td>Number:</td>
          <td><input value={props.newNumber} onChange={props.handleNumberChange}/></td>
        </tr>
        <tr>
          <td></td>
          <td><button type="submit">add</button></td>
        </tr>
      </tbody>
    </table>
  </form>
)

const Filter = props => (
  <div>
    Filter shown with &nbsp;
    <input value={props.filter} onChange={props.handleFilterChange}/>
  </div>
)

const Person = ({person, handleDelete}) => (
  <tr>
    <td>{person.name}</td>
    <td>{person.number}</td>
    <td><button onClick={handleDelete(person.id, person.name)}>delete</button></td>
  </tr>
)

const Persons = ({persons, handleDelete}) => (
  <table>
    <tbody>
      {persons.map(person => (
        <Person key={person.name} person={person} handleDelete={handleDelete}/>
      ))}
    </tbody>
  </table>
)

const Notification = ({text, color}) => {
  if(text === null) return null

  const notificationStyle = {
    color: color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={notificationStyle}>
      {text}
    </div>
  )
}

export { PersonForm, Filter, Person, Persons, Notification }