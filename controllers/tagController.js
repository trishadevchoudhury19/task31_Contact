const db = require('../db');

exports.getTags = async (req, res) => {
  try {
    const [tags] = await db.execute('SELECT * FROM tags');
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
