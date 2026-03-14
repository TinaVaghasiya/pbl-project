# Smart Sign Language Interpreter

A complete full-stack AI-powered web application for sign language interpretation and learning.

## Features

- **Text to Sign**: Convert text into sign language animations
- **Sign to Text**: Real-time sign language detection using webcam
- **Voice to Text**: Speech recognition for voice transcription
- **Learning Module**: Interactive lessons for alphabets, numbers, and words
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on all devices

## Technology Stack

### Frontend
- React.js with Vite
- TailwindCSS
- React Router
- Axios
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- REST API (MVC Architecture)

### AI/ML Service
- Python
- Flask
- OpenCV
- MediaPipe
- NumPy

## Project Structure

```
SignDetection/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── SignCard.jsx
│   │   │   └── common/
│   │   │       └── Loading.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Learning.jsx
│   │   │   ├── TextToSign.jsx
│   │   │   ├── SignToText.jsx
│   │   │   ├── VoiceToText.jsx
│   │   │   └── About.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── ThemeContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── learningController.js
│   │   ├── textToSignController.js
│   │   └── signToTextController.js
│   ├── models/
│   │   ├── LearningSign.js
│   │   ├── GestureLog.js
│   │   └── User.js
│   ├── routes/
│   │   ├── learning.js
│   │   ├── textToSign.js
│   │   └── signToText.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── server.js
│   ├── seed.js
│   └── package.json
└── python-ai/
    ├── app.py
    ├── gesture_detector.py
    └── requirements.txt
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud)

### 1. Clone the Repository
```bash
cd SignDetection
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sign_language_db
PYTHON_SERVICE_URL=http://localhost:5001
NODE_ENV=development
```

Start MongoDB (if using local):
```bash
mongod
```

Seed the database:
```bash
node seed.js
```

Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Python AI Service Setup

```bash
cd python-ai
pip install -r requirements.txt
```

Start Python service:
```bash
python app.py
```

Python service will run on `http://localhost:5001`

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Start frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Usage

1. **Home Page**: Navigate through features and learn about the platform
2. **Learning Module**: Browse sign language alphabets and numbers by category
3. **Text to Sign**: Type text and see corresponding sign animations
4. **Sign to Text**: Use webcam to detect signs in real-time
5. **Voice to Text**: Convert speech to text using microphone
6. **About**: Learn about the project and technology stack

## API Endpoints

### Learning Module
- `GET /api/learn` - Get all signs (with optional filters)
- `GET /api/learn/:id` - Get single sign
- `POST /api/learn` - Create new sign
- `PUT /api/learn/:id` - Update sign
- `DELETE /api/learn/:id` - Delete sign

### Text to Sign
- `POST /api/text-to-sign` - Convert text to sign sequence

### Sign to Text
- `POST /api/sign-to-text` - Process detected sign
- `GET /api/sign-to-text/history` - Get gesture history

### Python AI Service
- `GET /api/health` - Health check
- `POST /api/detect-sign` - Detect sign from image
- `POST /api/process-video` - Process video frame

## Browser Compatibility

- Chrome (Recommended)
- Edge
- Firefox
- Safari (limited speech recognition support)

## Camera & Microphone Permissions

The application requires:
- Camera access for Sign to Text feature
- Microphone access for Voice to Text feature

Please allow permissions when prompted.

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Python Service Development
```bash
cd python-ai
python app.py
```

## Production Build

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm start
```

## Future Enhancements

- User authentication and profiles
- Progress tracking
- More sign language gestures (words, sentences)
- Multi-language support
- Mobile app version
- Improved ML model accuracy
- Real-time video translation

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on the repository.

## Acknowledgments

- MediaPipe for hand tracking
- OpenCV for computer vision
- MongoDB for database
- React and Vite for frontend framework
- TailwindCSS for styling

---

**Built with ❤️ for accessibility and inclusion**
