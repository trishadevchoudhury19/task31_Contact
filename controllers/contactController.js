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
  console.log("Received user_id:", userId); // 👈 Add this

  try {
    const [contacts] = await db.execute(
      `SELECT c.*, GROUP_CONCAT(t.name) AS tags
       FROM contacts c
       LEFT JOIN contact_tags ct ON c.id = ct.contact_id
       LEFT JOIN tags t ON ct.tag_id = t.id
       WHERE c.user_id = ?
       GROUP BY c.id`, [userId]);

    console.log("Fetched contacts:", contacts); // 👈 Add this
    res.json(contacts);
  } catch (err) {
    console.error("Error fetching contacts:", err); // 👈 This will show the real problem
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
