require('dotenv').config();
const mongoose = require('mongoose');
const LearningSign = require('./models/LearningSign');

const updateImagePaths = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Update all signs to use .svg extension
    const result = await LearningSign.updateMany(
      {},
      [
        {
          $set: {
            image: {
              $concat: [
                '/signs/',
                { $toLower: '$letter' },
                '.svg'
              ]
            }
          }
        }
      ]
    );
    
    console.log(`Updated ${result.modifiedCount} documents`);
    
    // Verify
    const signs = await LearningSign.find().limit(5);
    console.log('\nSample updated records:');
    signs.forEach(sign => {
      console.log(`  ${sign.letter}: ${sign.image}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateImagePaths();
