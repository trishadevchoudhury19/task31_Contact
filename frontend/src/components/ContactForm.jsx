import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { toast } from 'react-toastify';

const ContactForm = ({ fetchContacts, editingContact, setEditingContact }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', tags: [] });
  const [tagOptions, setTagOptions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/tags').then(res => {
      const options = res.data.map(tag => ({ value: tag.id, label: tag.name }));
      setTagOptions(options);
    });
  }, []);

  useEffect(() => {
    if (editingContact) {
      const selectedTags = editingContact.tags?.split(',').map(tag => {
        const found = tagOptions.find(opt => opt.label === tag);
        return found || { label: tag, value: null };
      });
      setFormData({ ...editingContact, tags: selectedTags });
    }
  }, [editingContact, tagOptions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      tags: formData.tags.map(t => t.value),
      user_id: 1
    };

    try {
      if (editingContact) {
        await axios.put(`http://localhost:5000/contacts/${editingContact.id}`, payload);
        toast.success("Contact updated!");
        setEditingContact(null);
      } else {
        await axios.post("http://localhost:5000/contacts", payload);
        toast.success("Contact added!");
      }
      setFormData({ name: '', phone: '', email: '', tags: [] });
      fetchContacts();
    } catch (err) {
      toast.error("Failed to save contact");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body mb-4">
      <h4>{editingContact ? 'Edit Contact' : 'Add Contact'}</h4>
      <input
        className="form-control mb-2"
        placeholder="Name"
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Phone"
        value={formData.phone}
        onChange={e => setFormData({ ...formData, phone: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Email"
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
      />
      <Select
        isMulti
        options={tagOptions}
        value={formData.tags}
        onChange={(selected) => setFormData({ ...formData, tags: selected })}
        className="mb-2"
      />
      <button className="btn btn-primary">{editingContact ? 'Update' : 'Add'} Contact</button>
    </form>
  );
};

export default ContactForm;
