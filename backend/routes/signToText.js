const express = require('express');
const router = express.Router();
const signToTextController = require('../controllers/signToTextController');

router.post('/', signToTextController.processDetectedSign);
router.get('/history', signToTextController.getGestureHistory);

module.exports = router;
