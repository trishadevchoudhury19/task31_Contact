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
  const [searchQuery, setSearchQuery] = useState('');

  const fetchContacts = (query = '') => {
    let url = 'http://localhost:5000/contacts/1';
    if (query) url += `?search=${query}`;
    axios.get(url).then(res => {
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
    if (tag === 'favorite') {
      axios.get('http://localhost:5000/contacts/1?favorite=true').then(res => {
        setFiltered(res.data);
      });
    } else if (!tag) {
      setFiltered(contacts);
    } else {
      setFiltered(contacts.filter(contact => contact.tags?.includes(tag)));
    }
  };

  const toggleFavorite = (id) => {
    axios.put(`http://localhost:5000/contacts/${id}/favorite`).then(() => {
      toast.success("Favorite status updated!");
      fetchContacts(searchQuery);
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchContacts(query);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">📒 Contact Book</h2>

      {/* Search Bar */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="🔍 Search by name, phone, or email..."
        value={searchQuery}
        onChange={handleSearch}
      />

      {/* Favorites Toggle Button */}
      <div className="mb-3 text-center">
        <button
          className="btn btn-outline-warning"
          onClick={() => handleFilter('favorite')}
        >
          ⭐ Show Favorites
        </button>
        <button
          className="btn btn-outline-secondary ms-2"
          onClick={() => handleFilter(null)}
        >
          🔄 Show All
        </button>
      </div>

      <ContactForm
        fetchContacts={() => fetchContacts(searchQuery)}
        editingContact={editingContact}
        setEditingContact={setEditingContact}
      />

      <TagFilter onFilterChange={handleFilter} />

      <ContactList
        contacts={filtered}
        deleteContact={handleDelete}
        editContact={setEditingContact}
        toggleFavorite={toggleFavorite}
      />

      <ToastContainer />
    </div>
  );
}

export default App;
