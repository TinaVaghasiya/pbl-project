const LearningSign = require('../models/LearningSign');

// Get all learning signs
exports.getAllSigns = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (search) query.letter = new RegExp(search, 'i');
    
    const signs = await LearningSign.find(query).sort({ letter: 1 });
    res.json({ success: true, data: signs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single sign
exports.getSignById = async (req, res) => {
  try {
    const sign = await LearningSign.findById(req.params.id);
    if (!sign) {
      return res.status(404).json({ success: false, message: 'Sign not found' });
    }
    res.json({ success: true, data: sign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new sign
exports.createSign = async (req, res) => {
  try {
    const sign = await LearningSign.create(req.body);
    res.status(201).json({ success: true, data: sign });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update sign
exports.updateSign = async (req, res) => {
  try {
    const sign = await LearningSign.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sign) {
      return res.status(404).json({ success: false, message: 'Sign not found' });
    }
    res.json({ success: true, data: sign });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete sign
exports.deleteSign = async (req, res) => {
  try {
    const sign = await LearningSign.findByIdAndDelete(req.params.id);
    if (!sign) {
      return res.status(404).json({ success: false, message: 'Sign not found' });
    }
    res.json({ success: true, message: 'Sign deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
