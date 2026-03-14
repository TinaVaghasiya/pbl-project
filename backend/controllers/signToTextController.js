const GestureLog = require('../models/GestureLog');

// Process detected sign from Python service
exports.processDetectedSign = async (req, res) => {
  try {
    const { detectedSign, confidence } = req.body;
    
    if (!detectedSign) {
      return res.status(400).json({ success: false, message: 'Detected sign is required' });
    }
    
    // Log the gesture
    await GestureLog.create({ detectedSign, confidence: confidence || 0 });
    
    res.json({ 
      success: true, 
      data: { 
        detectedSign, 
        confidence,
        timestamp: new Date()
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get gesture history
exports.getGestureHistory = async (req, res) => {
  try {
    const logs = await GestureLog.find().sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
