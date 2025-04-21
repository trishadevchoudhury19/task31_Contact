const db = require('../db');

exports.createContact = async (req, res) => {
  const { name, phone, email, user_id, tags } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO contacts (name, phone, email, user_id) VALUES (?, ?, ?, ?)',
      [name, phone, email, user_id]
    );
    const contactId = result.insertId;

    for (let tag of tags) {
      await db.execute('INSERT INTO contact_tags (contact_id, tag_id) VALUES (?, ?)', [contactId, tag]);
    }

    res.status(201).json({ message: 'Contact created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getContacts = async (req, res) => {
  const userId = req.params.user_id;
  const { favorite, search } = req.query;

  let query = `
    SELECT c.*, GROUP_CONCAT(t.name) AS tags
    FROM contacts c
    LEFT JOIN contact_tags ct ON c.id = ct.contact_id
    LEFT JOIN tags t ON ct.tag_id = t.id
    WHERE c.user_id = ?
  `;
  const params = [userId];

  if (favorite === 'true') {
    query += ' AND c.is_favorite = true';
  }

  if (search) {
    query += ` AND (c.name LIKE ? OR c.phone LIKE ? OR c.email LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' GROUP BY c.id';

  try {
    const [contacts] = await db.execute(query, params);
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateContact = async (req, res) => {
  const contactId = req.params.id;
  const { name, phone, email, tags } = req.body;
  try {
    await db.execute(
      'UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?',
      [name, phone, email, contactId]
    );

    await db.execute('DELETE FROM contact_tags WHERE contact_id = ?', [contactId]);

    for (let tag of tags) {
      await db.execute('INSERT INTO contact_tags (contact_id, tag_id) VALUES (?, ?)', [contactId, tag]);
    }

    res.json({ message: 'Contact updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteContact = async (req, res) => {
  const contactId = req.params.id;
  try {
    await db.execute('DELETE FROM contacts WHERE id = ?', [contactId]);
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// In contactController.js
exports.toggleFavorite = async (req, res) => {
  const contactId = req.params.id;
  try {
    const [result] = await db.execute('SELECT is_favorite FROM contacts WHERE id = ?', [contactId]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    const currentStatus = result[0].is_favorite;
    const newStatus = !currentStatus;

    await db.execute('UPDATE contacts SET is_favorite = ? WHERE id = ?', [newStatus, contactId]);

    res.json({ message: 'Favorite status updated', is_favorite: newStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

