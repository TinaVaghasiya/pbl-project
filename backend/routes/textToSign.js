const express = require('express');
const router = express.Router();
const textToSignController = require('../controllers/textToSignController');

router.post('/', textToSignController.textToSign);

module.exports = router;
