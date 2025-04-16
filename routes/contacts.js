const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactController');

router.post('/', controller.createContact);
router.get('/:user_id', controller.getContacts);
router.put('/:id', controller.updateContact);
router.delete('/:id', controller.deleteContact);

module.exports = router;
