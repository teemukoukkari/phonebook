import axios from 'axios'

const base_url = '/api/persons'

const getAll = () => (
    axios
        .get(base_url)
        .then(response => response.data)
)

const createPerson = person => (
    axios
        .post(base_url, person)
        .then(response => response.data)
)

const deletePerson = id => (
    axios
        .delete(`${base_url}/${id}`)
)

const updatePerson = (id,person) => (
    axios
        .put(`${base_url}/${id}`, person)
        .then(response => response.data)
)

const personService = {
    getAll,
    createPerson,
    deletePerson,
    updatePerson
}
export default personService