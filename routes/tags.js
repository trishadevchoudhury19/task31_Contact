const express = require('express');
const router = express.Router();
const controller = require('../controllers/tagController');

router.get('/', controller.getTags);

module.exports = router;
