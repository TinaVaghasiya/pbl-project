# Backend API Documentation

Node.js + Express.js REST API for Sign Language Interpreter

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
node seed.js
npm run dev
```

## API Endpoints

### Health Check
```
GET /api/health
Response: { success: true, message: "Server is running" }
```

### Learning Module

#### Get All Signs
```
GET /api/learn
Query Parameters:
  - category: alphabet | number | word | sentence
  - search: string

Response: {
  success: true,
  data: [
    {
      _id: "...",
      letter: "A",
      category: "alphabet",
      image: "/signs/a.png",
      description: "Closed fist with thumb on side",
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Single Sign
```
GET /api/learn/:id
Response: { success: true, data: {...} }
```

#### Create Sign
```
POST /api/learn
Body: {
  letter: "A",
  category: "alphabet",
  image: "/signs/a.png",
  description: "Closed fist with thumb on side"
}
Response: { success: true, data: {...} }
```

#### Update Sign
```
PUT /api/learn/:id
Body: { description: "Updated description" }
Response: { success: true, data: {...} }
```

#### Delete Sign
```
DELETE /api/learn/:id
Response: { success: true, message: "Sign deleted successfully" }
```

### Text to Sign

#### Convert Text to Signs
```
POST /api/text-to-sign
Body: { text: "HELLO" }
Response: {
  success: true,
  originalText: "HELLO",
  data: [
    { letter: "H", image: "/signs/h.png", description: "..." },
    { letter: "E", image: "/signs/e.png", description: "..." },
    ...
  ]
}
```

### Sign to Text

#### Process Detected Sign
```
POST /api/sign-to-text
Body: {
  detectedSign: "A",
  confidence: 0.85
}
Response: {
  success: true,
  data: {
    detectedSign: "A",
    confidence: 0.85,
    timestamp: "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Gesture History
```
GET /api/sign-to-text/history
Response: {
  success: true,
  data: [
    {
      _id: "...",
      detectedSign: "A",
      confidence: 0.85,
      timestamp: "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Database Models

### LearningSign
- letter: String (required, unique)
- category: String (enum: alphabet, number, word, sentence)
- image: String (required)
- description: String (required)
- createdAt: Date

### GestureLog
- detectedSign: String (required)
- confidence: Number
- timestamp: Date

### User
- name: String (required)
- email: String (required, unique)
- progress: Number
- createdAt: Date
