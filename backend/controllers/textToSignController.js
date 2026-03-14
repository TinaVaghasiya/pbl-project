const LearningSign = require('../models/LearningSign');

// Convert text to sign sequence
exports.textToSign = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }
    
    const letters = text.toUpperCase().split('').filter(char => /[A-Z0-9]/.test(char));
    const signs = [];
    
    for (let letter of letters) {
      const sign = await LearningSign.findOne({ letter, category: { $in: ['alphabet', 'number'] } });
      if (sign) {
        signs.push(sign);
      } else {
        signs.push({ letter, image: null, description: 'Sign not available' });
      }
    }
    
    res.json({ success: true, data: signs, originalText: text });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
