require('dotenv').config();
const mongoose = require('mongoose');
const LearningSign = require('./models/LearningSign');

const commonWords = [
  // Greetings
  { letter: 'HELLO', category: 'word', image: '/signs/hello.jpg', description: 'Wave hand side to side near ear' },
  { letter: 'GOODBYE', category: 'word', image: '/signs/goodbye.jpg', description: 'Open hand, close fingers repeatedly' },
  { letter: 'THANKS', category: 'word', image: '/signs/thanks.jpg', description: 'Flat hand touches chin, moves forward' },
  { letter: 'PLEASE', category: 'word', image: '/signs/please.jpg', description: 'Flat hand circles on chest' },
  { letter: 'SORRY', category: 'word', image: '/signs/sorry.jpg', description: 'Fist circles on chest' },
  
  // Yes/No
  { letter: 'YES', category: 'word', image: '/signs/yes.jpg', description: 'Fist nods up and down like head nodding' },
  { letter: 'NO', category: 'word', image: '/signs/no.jpg', description: 'Index and middle finger snap to thumb' },
  
  // Common actions
  { letter: 'HELP', category: 'word', image: '/signs/help.jpg', description: 'Thumbs up on flat palm, lift up' },
  { letter: 'LOVE', category: 'word', image: '/signs/love.jpg', description: 'Cross fists over heart' },
  { letter: 'EAT', category: 'word', image: '/signs/eat.jpg', description: 'Fingertips touch mouth repeatedly' },
  { letter: 'DRINK', category: 'word', image: '/signs/drink.jpg', description: 'C-hand moves to mouth like drinking' },
  { letter: 'SLEEP', category: 'word', image: '/signs/sleep.jpg', description: 'Flat hand moves down face, eyes close' },
  
  // People
  { letter: 'FRIEND', category: 'word', image: '/signs/friend.jpg', description: 'Hook index fingers, switch positions' },
  { letter: 'FAMILY', category: 'word', image: '/signs/family.jpg', description: 'F-hands circle around to touch' },
  { letter: 'MOTHER', category: 'word', image: '/signs/mother.jpg', description: 'Thumb of open hand touches chin' },
  { letter: 'FATHER', category: 'word', image: '/signs/father.jpg', description: 'Thumb of open hand touches forehead' },
  
  // Feelings
  { letter: 'HAPPY', category: 'word', image: '/signs/happy.jpg', description: 'Flat hands brush up chest repeatedly' },
  { letter: 'SAD', category: 'word', image: '/signs/sad.jpg', description: 'Open hands move down face' },
  { letter: 'ANGRY', category: 'word', image: '/signs/angry.jpg', description: 'Claw hand moves up from face' },
  
  // Basic needs
  { letter: 'WATER', category: 'word', image: '/signs/water.jpg', description: 'W-hand taps chin twice' },
  { letter: 'FOOD', category: 'word', image: '/signs/food.jpg', description: 'Fingertips touch mouth' },
  { letter: 'HOME', category: 'word', image: '/signs/home.jpg', description: 'Fingertips touch mouth then cheek' },
  { letter: 'WORK', category: 'word', image: '/signs/work.jpg', description: 'Fists tap wrists together' },
  { letter: 'SCHOOL', category: 'word', image: '/signs/school.jpg', description: 'Clap hands twice' },
];

const addWords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    console.log('=' * 60);
    
    let added = 0;
    let updated = 0;
    
    for (const word of commonWords) {
      const existing = await LearningSign.findOne({ letter: word.letter });
      
      if (existing) {
        await LearningSign.findOneAndUpdate(
          { letter: word.letter },
          word,
          { new: true }
        );
        console.log(`✓ Updated: ${word.letter}`);
        updated++;
      } else {
        await LearningSign.create(word);
        console.log(`✓ Added: ${word.letter}`);
        added++;
      }
    }
    
    console.log('=' * 60);
    console.log(`\n✅ Success!`);
    console.log(`   Added: ${added} new words`);
    console.log(`   Updated: ${updated} existing words`);
    console.log(`   Total: ${commonWords.length} words\n`);
    
    const totalWords = await LearningSign.countDocuments({ category: 'word' });
    console.log(`📊 Total words in database: ${totalWords}`);
    
    console.log('\n📝 Next steps:');
    console.log('   1. Download word images from: https://www.handspeak.com/word/');
    console.log('   2. Or use: https://www.signingsavvy.com/');
    console.log('   3. Save images to: frontend/public/signs/');
    console.log('   4. Name them: hello.jpg, thanks.jpg, etc.');
    console.log('   5. Refresh browser to see images!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

addWords();
