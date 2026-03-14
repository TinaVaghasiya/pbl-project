require('dotenv').config();
const mongoose = require('mongoose');
const LearningSign = require('./models/LearningSign');

const seedData = [
  // Alphabets
  { letter: 'A', category: 'alphabet', image: '/signs/a.jpg', description: 'Closed fist with thumb on side' },
  { letter: 'B', category: 'alphabet', image: '/signs/b.jpg', description: 'Flat hand with thumb across palm' },
  { letter: 'C', category: 'alphabet', image: '/signs/c.jpg', description: 'Curved hand forming C shape' },
  { letter: 'D', category: 'alphabet', image: '/signs/d.jpg', description: 'Index finger up, thumb and middle finger touching' },
  { letter: 'E', category: 'alphabet', image: '/signs/e.jpg', description: 'Fingers curled, thumb across fingertips' },
  { letter: 'F', category: 'alphabet', image: '/signs/f.jpg', description: 'Index and thumb form circle, other fingers up' },
  { letter: 'G', category: 'alphabet', image: '/signs/g.jpg', description: 'Index and thumb pointing sideways' },
  { letter: 'H', category: 'alphabet', image: '/signs/h.jpg', description: 'Index and middle finger pointing sideways' },
  { letter: 'I', category: 'alphabet', image: '/signs/i.jpg', description: 'Pinky finger up, other fingers closed' },
  { letter: 'J', category: 'alphabet', image: '/signs/j.jpg', description: 'Pinky finger draws J shape' },
  { letter: 'K', category: 'alphabet', image: '/signs/k.jpg', description: 'Index and middle finger up, thumb between them' },
  { letter: 'L', category: 'alphabet', image: '/signs/l.jpg', description: 'Index finger and thumb form L shape' },
  { letter: 'M', category: 'alphabet', image: '/signs/m.jpg', description: 'Thumb under three fingers' },
  { letter: 'N', category: 'alphabet', image: '/signs/n.jpg', description: 'Thumb under two fingers' },
  { letter: 'O', category: 'alphabet', image: '/signs/o.jpg', description: 'Fingers and thumb form O shape' },
  { letter: 'P', category: 'alphabet', image: '/signs/p.jpg', description: 'Like K but pointing down' },
  { letter: 'Q', category: 'alphabet', image: '/signs/q.jpg', description: 'Like G but pointing down' },
  { letter: 'R', category: 'alphabet', image: '/signs/r.jpg', description: 'Index and middle finger crossed' },
  { letter: 'S', category: 'alphabet', image: '/signs/s.jpg', description: 'Fist with thumb across fingers' },
  { letter: 'T', category: 'alphabet', image: '/signs/t.jpg', description: 'Thumb between index and middle finger' },
  { letter: 'U', category: 'alphabet', image: '/signs/u.jpg', description: 'Index and middle finger together pointing up' },
  { letter: 'V', category: 'alphabet', image: '/signs/v.jpg', description: 'Index and middle finger apart forming V' },
  { letter: 'W', category: 'alphabet', image: '/signs/w.jpg', description: 'Three fingers up forming W' },
  { letter: 'X', category: 'alphabet', image: '/signs/x.jpg', description: 'Index finger bent like hook' },
  { letter: 'Y', category: 'alphabet', image: '/signs/y.jpg', description: 'Thumb and pinky extended' },
  { letter: 'Z', category: 'alphabet', image: '/signs/z.jpg', description: 'Index finger draws Z shape' },
  
  // Numbers
  { letter: '0', category: 'number', image: '/signs/0.png', description: 'Fingers and thumb form O shape' },
  { letter: '1', category: 'number', image: '/signs/1.png', description: 'Index finger pointing up' },
  { letter: '2', category: 'number', image: '/signs/2.png', description: 'Index and middle finger up' },
  { letter: '3', category: 'number', image: '/signs/3.png', description: 'Thumb, index and middle finger up' },
  { letter: '4', category: 'number', image: '/signs/4.png', description: 'Four fingers up, thumb folded' },
  { letter: '5', category: 'number', image: '/signs/5.png', description: 'All five fingers spread out' },
  { letter: '6', category: 'number', image: '/signs/6.png', description: 'Thumb and pinky touching, three fingers up' },
  { letter: '7', category: 'number', image: '/signs/7.png', description: 'Thumb and ring finger touching' },
  { letter: '8', category: 'number', image: '/signs/8.png', description: 'Thumb and middle finger touching' },
  { letter: '9', category: 'number', image: '/signs/9.png', description: 'Thumb and index finger touching' }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await LearningSign.deleteMany({});
    console.log('Cleared existing data');
    
    await LearningSign.insertMany(seedData);
    console.log('Seed data inserted successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
