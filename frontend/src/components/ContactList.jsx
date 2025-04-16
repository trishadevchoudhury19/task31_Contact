import React from 'react';

const ContactList = ({ contacts, deleteContact, editContact }) => (
  <div>
    {contacts.map(contact => (
      <div key={contact.id} className="card mb-2">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5>{contact.name}</h5>
            <p>{contact.phone} | {contact.email}</p>
            <small className="text-muted">Tags: {contact.tags}</small>
          </div>
          <div>
            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editContact(contact)}>Edit</button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteContact(contact.id)}>Delete</button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ContactList;
