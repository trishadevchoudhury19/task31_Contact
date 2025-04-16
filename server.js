const express = require('express');
const cors = require('cors');
const app = express();
const contactRoutes = require('./routes/contacts');
const tagRoutes = require('./routes/tags');

app.use(cors());
app.use(express.json());
app.use('/contacts', contactRoutes);
app.use('/tags', tagRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
