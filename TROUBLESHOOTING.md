# Troubleshooting Guide

Common issues and solutions for the Smart Sign Language Interpreter.

## Installation Issues

### Node.js Installation Failed
**Problem**: npm install fails with errors

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use specific Node version
nvm install 18
nvm use 18
```

### Python Dependencies Failed
**Problem**: pip install fails

**Solutions**:
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install with verbose output
pip install -r requirements.txt -v

# Install specific versions
pip install opencv-python==4.8.1.78

# Use virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### MongoDB Connection Failed
**Problem**: Cannot connect to MongoDB

**Solutions**:
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# Linux/Mac:
sudo systemctl status mongod
sudo systemctl start mongod

# Verify connection
mongo --eval "db.version()"

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/sign_language_db
```

## Runtime Issues

### Backend Server Won't Start
**Problem**: Server crashes on startup

**Solutions**:
1. Check if port 5000 is already in use:
```bash
# Windows:
netstat -ano | findstr :5000

# Linux/Mac:
lsof -i :5000
```

2. Kill process using the port:
```bash
# Windows:
taskkill /PID <PID> /F

# Linux/Mac:
kill -9 <PID>
```

3. Check environment variables:
```bash
# Verify .env file exists
cat backend/.env

# Check for syntax errors
```

4. Check logs:
```bash
cd backend
npm run dev
# Read error messages
```

### Python Service Won't Start
**Problem**: Flask app crashes

**Solutions**:
1. Check Python version:
```bash
python --version  # Should be 3.8+
```

2. Verify all dependencies:
```bash
pip list
pip check
```

3. Test imports:
```bash
python -c "import cv2; import mediapipe; import flask"
```

4. Check port 5001:
```bash
# Windows:
netstat -ano | findstr :5001

# Linux/Mac:
lsof -i :5001
```

### Frontend Build Fails
**Problem**: npm run build fails

**Solutions**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for syntax errors in components
npm run lint

# Build with verbose output
npm run build -- --debug
```

## Feature-Specific Issues

### Camera Not Working

**Problem**: Webcam doesn't start in Sign to Text

**Solutions**:
1. Check browser permissions:
   - Chrome: Settings > Privacy > Camera
   - Allow camera access for localhost

2. Verify HTTPS (required for camera):
   - Use `https://localhost` or
   - Use Chrome flag: `chrome://flags/#unsafely-treat-insecure-origin-as-secure`

3. Check if camera is in use:
   - Close other apps using camera
   - Restart browser

4. Test camera access:
```javascript
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => console.log('Camera works!'))
  .catch(err => console.error('Camera error:', err));
```

### Speech Recognition Not Working

**Problem**: Voice to Text doesn't recognize speech

**Solutions**:
1. Use supported browser:
   - Chrome (recommended)
   - Edge
   - NOT Firefox or Safari

2. Check microphone permissions:
   - Browser settings > Microphone
   - Allow access for localhost

3. Test microphone:
```javascript
if ('webkitSpeechRecognition' in window) {
  console.log('Speech recognition supported');
} else {
  console.log('Speech recognition NOT supported');
}
```

4. Ensure HTTPS or localhost

### Sign Detection Not Accurate

**Problem**: AI doesn't detect signs correctly

**Solutions**:
1. Improve lighting:
   - Use bright, even lighting
   - Avoid backlighting

2. Optimize hand position:
   - Keep hand in center of frame
   - Maintain distance from camera
   - Show full hand clearly

3. Adjust detection settings:
```python
# In gesture_detector.py
hands = mp_hands.Hands(
    min_detection_confidence=0.5,  # Lower for easier detection
    min_tracking_confidence=0.3     # Lower for better tracking
)
```

4. Hold gesture steady:
   - Hold for 1-2 seconds
   - Avoid quick movements

### Text to Sign Shows No Images

**Problem**: Sign images not displaying

**Solutions**:
1. Check image paths:
```javascript
// In seed.js, verify paths
image: '/signs/a.png'  // Should match public folder structure
```

2. Add placeholder images:
```bash
cd frontend/public/signs
# Add image files: a.png, b.png, etc.
```

3. Verify public folder:
```bash
ls frontend/public/signs
```

4. Check browser console for 404 errors

## API Issues

### CORS Errors

**Problem**: API requests blocked by CORS

**Solutions**:
1. Check backend CORS configuration:
```javascript
// In server.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

2. Verify frontend API URLs:
```javascript
// In api.js
const API_BASE_URL = 'http://localhost:5000/api';
```

3. Check browser console for specific CORS error

### API Returns 404

**Problem**: Endpoint not found

**Solutions**:
1. Verify route definitions:
```javascript
// Check routes are registered in server.js
app.use('/api/learn', require('./routes/learning'));
```

2. Check endpoint URL:
```bash
# Correct:
http://localhost:5000/api/learn

# Incorrect:
http://localhost:5000/learn
```

3. Restart backend server

### API Returns 500 Error

**Problem**: Internal server error

**Solutions**:
1. Check backend logs:
```bash
cd backend
npm run dev
# Read error stack trace
```

2. Verify database connection:
```bash
mongo
use sign_language_db
db.learningsigns.find()
```

3. Check request payload format:
```bash
# Ensure JSON is valid
curl -X POST http://localhost:5000/api/text-to-sign \
  -H "Content-Type: application/json" \
  -d '{"text": "HELLO"}'
```

## Database Issues

### Database Empty After Seeding

**Problem**: No data in database

**Solutions**:
```bash
# Run seed script
cd backend
node seed.js

# Verify data
mongo
use sign_language_db
db.learningsigns.count()
db.learningsigns.find().pretty()
```

### Cannot Connect to MongoDB

**Problem**: Connection timeout or refused

**Solutions**:
1. Check MongoDB is running:
```bash
# Windows:
net start MongoDB

# Linux/Mac:
sudo systemctl start mongod
```

2. Verify connection string:
```bash
# Local:
MONGODB_URI=mongodb://localhost:27017/sign_language_db

# Atlas:
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sign_language_db
```

3. Check firewall:
```bash
# Allow MongoDB port
sudo ufw allow 27017
```

## Performance Issues

### Slow API Response

**Problem**: API takes too long to respond

**Solutions**:
1. Add database indexes:
```javascript
// In models
schema.index({ letter: 1 });
schema.index({ category: 1 });
```

2. Optimize queries:
```javascript
// Use lean() for read-only queries
const signs = await LearningSign.find().lean();
```

3. Enable caching:
```javascript
// Add Redis caching
const redis = require('redis');
const client = redis.createClient();
```

### High Memory Usage

**Problem**: Application uses too much memory

**Solutions**:
1. Limit query results:
```javascript
const signs = await LearningSign.find().limit(100);
```

2. Close database connections:
```javascript
mongoose.connection.close();
```

3. Optimize Python AI:
```python
# Release resources
detector.release()
cv2.destroyAllWindows()
```

### Slow Video Processing

**Problem**: Sign detection is laggy

**Solutions**:
1. Reduce frame rate:
```javascript
// Process every 2 seconds instead of 1
setInterval(() => captureAndDetect(), 2000);
```

2. Lower video resolution:
```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  video: { width: 320, height: 240 }  // Lower resolution
});
```

3. Optimize Python processing:
```python
# Resize frame before processing
frame = cv2.resize(frame, (320, 240))
```

## Browser-Specific Issues

### Chrome Issues
- Clear cache: Ctrl+Shift+Delete
- Disable extensions
- Try incognito mode

### Firefox Issues
- Speech recognition not supported
- Use Chrome instead for full features

### Safari Issues
- Limited speech recognition
- Camera permissions different
- Use Chrome for best experience

## Getting Help

### Check Logs
```bash
# Backend logs
cd backend && npm run dev

# Python logs
cd python-ai && python app.py

# Frontend console
# Open browser DevTools (F12)
```

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm run dev
```

### Report Issues
1. Describe the problem
2. Include error messages
3. Provide steps to reproduce
4. Share relevant logs
5. Mention browser/OS version

## Quick Fixes

### Reset Everything
```bash
# Stop all services
# Delete node_modules
rm -rf frontend/node_modules backend/node_modules

# Reinstall
cd frontend && npm install
cd ../backend && npm install
cd ../python-ai && pip install -r requirements.txt

# Reset database
mongo
use sign_language_db
db.dropDatabase()

# Reseed
cd backend && node seed.js

# Restart all services
```

### Clear All Caches
```bash
# npm cache
npm cache clean --force

# Browser cache
# Ctrl+Shift+Delete in browser

# Python cache
find . -type d -name __pycache__ -exec rm -rf {} +
```
