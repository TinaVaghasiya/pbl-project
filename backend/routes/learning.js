const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');

router.get('/', learningController.getAllSigns);
router.get('/:id', learningController.getSignById);
router.post('/', learningController.createSign);
router.put('/:id', learningController.updateSign);
router.delete('/:id', learningController.deleteSign);

module.exports = router;
