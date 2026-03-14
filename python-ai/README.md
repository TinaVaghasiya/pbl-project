# Python AI Service Documentation

Flask-based AI service for hand gesture detection and sign language recognition.

## Setup

```bash
pip install -r requirements.txt
python app.py
```

Service runs on `http://localhost:5001`

## Dependencies

- **Flask**: Web framework for API
- **Flask-CORS**: Cross-origin resource sharing
- **OpenCV**: Computer vision library
- **MediaPipe**: Hand landmark detection
- **NumPy**: Numerical computations
- **Requests**: HTTP library for backend communication

## API Endpoints

### Health Check
```
GET /api/health
Response: {
  success: true,
  message: "Python AI service is running"
}
```

### Detect Sign from Image
```
POST /api/detect-sign
Body: {
  image: "data:image/jpeg;base64,..."
}
Response: {
  success: true,
  detectedSign: "A",
  confidence: 0.85
}
```

### Process Video Frame
```
POST /api/process-video
Body: {
  frame: "data:image/jpeg;base64,..."
}
Response: {
  success: true,
  handDetected: true,
  detectedSign: "A",
  confidence: 0.85
}
```

## How It Works

### 1. Hand Detection
- Uses MediaPipe Hands solution
- Detects up to 21 hand landmarks
- Tracks hand position and orientation

### 2. Feature Extraction
- Extracts 3D coordinates (x, y, z) for each landmark
- Creates feature vector of 63 values (21 landmarks × 3 coordinates)

### 3. Gesture Recognition
- Currently uses rule-based detection (demo)
- Counts extended fingers
- Analyzes finger positions and angles

### 4. Sign Prediction
- Returns detected sign letter/number
- Provides confidence score (0.0 - 1.0)
- Sends results to backend for logging

## Hand Landmarks

MediaPipe detects 21 landmarks per hand:

```
0: WRIST
1-4: THUMB (CMC, MCP, IP, TIP)
5-8: INDEX_FINGER (MCP, PIP, DIP, TIP)
9-12: MIDDLE_FINGER (MCP, PIP, DIP, TIP)
13-16: RING_FINGER (MCP, PIP, DIP, TIP)
17-20: PINKY (MCP, PIP, DIP, TIP)
```

## Gesture Detection Logic

### Current Implementation (Rule-Based)
- Counts extended fingers
- 0 fingers: "A" or "S"
- 1 finger: "1" or "D"
- 2 fingers: "V", "U", or "2"
- 3 fingers: "W" or "3"
- 5 fingers: "5" or "B"

### Future Enhancement (ML Model)
Replace rule-based logic with trained model:
1. Collect training data
2. Train CNN or LSTM model
3. Save model weights
4. Load and use for prediction

## Improving Accuracy

### Data Collection
```python
# Collect hand landmark data
# Label with correct signs
# Save to dataset
```

### Model Training
```python
# Use TensorFlow/PyTorch
# Train on collected dataset
# Validate and test
# Export model
```

### Model Integration
```python
# Load trained model
# Replace predict_sign() method
# Use model for inference
```

## Configuration

### MediaPipe Settings
```python
hands = mp_hands.Hands(
    static_image_mode=False,      # Video stream mode
    max_num_hands=1,               # Detect one hand
    min_detection_confidence=0.7,  # Detection threshold
    min_tracking_confidence=0.5    # Tracking threshold
)
```

### Adjust for Better Performance
- Increase confidence thresholds for accuracy
- Decrease for better detection rate
- Balance based on use case

## Troubleshooting

### Camera Issues
- Ensure camera permissions granted
- Check camera is not used by other apps
- Try different camera index

### Detection Issues
- Ensure good lighting
- Keep hand in frame
- Avoid cluttered background
- Hold gesture steady for 1-2 seconds

### Performance Issues
- Reduce frame processing rate
- Lower image resolution
- Optimize detection parameters

## Future Enhancements

1. **ML Model Integration**
   - Train deep learning model
   - Support more gestures
   - Improve accuracy

2. **Word Recognition**
   - Detect gesture sequences
   - Recognize common words
   - Context-aware prediction

3. **Multi-Hand Support**
   - Detect both hands
   - Two-handed signs
   - Complex gestures

4. **Real-time Optimization**
   - Reduce latency
   - Optimize processing
   - GPU acceleration
