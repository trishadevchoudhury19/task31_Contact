import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import TagFilter from './components/TagFilter';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [contacts, setContacts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [editingContact, setEditingContact] = useState(null);

  const fetchContacts = () => {
    axios.get('http://localhost:5000/contacts/1').then(res => {
      setContacts(res.data);
      setFiltered(res.data);
    });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/contacts/${id}`).then(() => {
      fetchContacts();
    });
  };

  const handleFilter = (tag) => {
    if (!tag) return setFiltered(contacts);
    setFiltered(contacts.filter(contact => contact.tags?.includes(tag)));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">📒 Contact Book</h2>
      <ContactForm fetchContacts={fetchContacts} editingContact={editingContact} setEditingContact={setEditingContact} />
      <TagFilter onFilterChange={handleFilter} />
      <ContactList contacts={filtered} deleteContact={handleDelete} editContact={setEditingContact} />
      <ToastContainer />
    </div>
  );
}

export default App;
