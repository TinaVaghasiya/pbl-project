require('dotenv').config();
const mongoose = require('mongoose');
const LearningSign = require('./models/LearningSign');

const commonWords = [
  // Greetings
  { letter: 'HELLO', category: 'word', image: '/signs/hello.jpg', description: 'Wave hand side to side' },
  { letter: 'GOODBYE', category: 'word', image: '/signs/goodbye.jpg', description: 'Wave hand up and down' },
  { letter: 'THANKS', category: 'word', image: '/signs/thanks.jpg', description: 'Touch chin and move forward' },
  { letter: 'PLEASE', category: 'word', image: '/signs/please.jpg', description: 'Circle hand on chest' },
  { letter: 'SORRY', category: 'word', image: '/signs/sorry.jpg', description: 'Circle fist on chest' },
  
  // Common words
  { letter: 'YES', category: 'word', image: '/signs/yes.jpg', description: 'Nod fist up and down' },
  { letter: 'NO', category: 'word', image: '/signs/no.jpg', description: 'Snap fingers together' },
  { letter: 'HELP', category: 'word', image: '/signs/help.jpg', description: 'Thumbs up on flat hand' },
  { letter: 'LOVE', category: 'word', image: '/signs/love.jpg', description: 'Cross arms over chest' },
  { letter: 'FRIEND', category: 'word', image: '/signs/friend.jpg', description: 'Hook index fingers together' },
  { letter: 'FAMILY', category: 'word', image: '/signs/family.jpg', description: 'F hands in circle' },
  { letter: 'EAT', category: 'word', image: '/signs/eat.jpg', description: 'Touch fingers to mouth' },
  { letter: 'DRINK', category: 'word', image: '/signs/drink.jpg', description: 'C hand to mouth' },
  { letter: 'SLEEP', category: 'word', image: '/signs/sleep.jpg', description: 'Hand down face' },
  { letter: 'WORK', category: 'word', image: '/signs/work.jpg', description: 'Tap wrists together' },
];

const addCommonWords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Add words (don't delete existing data)
    for (const word of commonWords) {
      await LearningSign.findOneAndUpdate(
        { letter: word.letter },
        word,
        { upsert: true, new: true }
      );
      console.log(`Added/Updated: ${word.letter}`);
    }
    
    console.log('\nCommon words added successfully!');
    
    const count = await LearningSign.countDocuments({ category: 'word' });
    console.log(`Total words in database: ${count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addCommonWords();
