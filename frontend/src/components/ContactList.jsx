import React from 'react';

function ContactList({ contacts, deleteContact, editContact, toggleFavorite }) {
  return (
    <div className="list-group">
      {contacts.map(contact => (
        <div key={contact.id} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <h5>
              {contact.name}
              <button
                className="btn btn-sm btn-link ms-2"
                onClick={() => toggleFavorite(contact.id)}
                title="Toggle Favorite"
              >
                {contact.is_favorite ? '⭐' : '☆'}
              </button>
            </h5>
            <p className="mb-1">📞 {contact.phone}</p>
            <p className="mb-1">✉️ {contact.email}</p>
            {contact.tags && (
              <p className="mb-1">🏷 Tags: {contact.tags}</p>
            )}
          </div>
          <div>
            <button className="btn btn-primary me-2" onClick={() => editContact(contact)}>Edit</button>
            <button className="btn btn-danger" onClick={() => deleteContact(contact.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContactList;
