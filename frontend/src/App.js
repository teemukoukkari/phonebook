import { React, useEffect, useState } from 'react'
import { PersonForm, Filter, Persons, Notification } from './components'
import personService from './personService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationText, setNotificationText] = useState(null)
  const [notificationColor, setNotificationColor] = useState('green')

  useEffect(() => {
    personService.getAll().then(persons => setPersons(persons))
  }, [])

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().startsWith(filter)
  )

  const createNotification = (text, color, duration) => {
    setNotificationText(text)
    setNotificationColor(color)
    setTimeout(() => {
      setNotificationText(null)
    }, duration)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setNewName('');
    setNewNumber('');

    const newPerson = {
      name: newName,
      number: newNumber
    }

    let oldPerson = persons.find(p => p.name === newName)
    if(oldPerson) {
      const msg = `${newName} is already added to phonebook, replace the old Number with a new one?`
      if(!window.confirm(msg)) return

      personService.updatePerson(oldPerson.id, newPerson)
        .then(person => {
          setPersons(persons.filter(p => p.id !== oldPerson.id).concat(person))
          createNotification(`Updated ${person.name}`, 'green', 3000)
        })
        .catch(error => {
          createNotification(`${error.response.data.error}`, 'red', 3000)
        })
      return
    }

    personService.createPerson(newPerson)
      .then(person => {
        setPersons(persons.concat(person))
        createNotification(`Added ${person.name}`, 'green', 3000)
      })
      .catch(error => {
        createNotification(`${error.response.data.error}`, 'red', 3000)
      })
  }

  const handleDelete = (id,name) => () => {
    if(!window.confirm(`Delete ${name} ?`)) return

    personService.deletePerson(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
        createNotification(`Deleted ${name}`, 'green', 3000)
      })
      .catch(() => {
        setPersons(persons.filter(person => person.id !== id))
        createNotification(`Information of ${name} has already been removed from server`, 'red', 3000)
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification text={notificationText} color={notificationColor}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>

      <h3>Add a new</h3>
      <PersonForm 
        handleSubmit={handleSubmit} 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}/>

      <h3>Numbers</h3>
      <Persons persons={filteredPersons} handleDelete={handleDelete}/>
    </div>
  )
}

export default App