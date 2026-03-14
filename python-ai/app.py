from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import cv2
import base64
import numpy as np
from gesture_detector import GestureDetector
import requests
import json

app = Flask(__name__)
CORS(app)

detector = GestureDetector()
BACKEND_URL = 'http://localhost:5002'

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'success': True, 'message': 'Python AI service is running'})

@app.route('/api/detect-sign', methods=['POST'])
def detect_sign():
    """Detect sign from base64 encoded image"""
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'success': False, 'message': 'No image provided'}), 400
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1] if ',' in image_data else image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Detect hand landmarks
        results = detector.detect_hand_landmarks(frame)
        
        if results.multi_hand_landmarks:
            hand_landmarks = results.multi_hand_landmarks[0]
            features = detector.extract_features(hand_landmarks)
            detected_sign, confidence = detector.predict_sign(features)
            
            if detected_sign:
                # Send to backend
                try:
                    response = requests.post(
                        f'{BACKEND_URL}/api/sign-to-text',
                        json={'detectedSign': detected_sign, 'confidence': confidence}
                    )
                except:
                    pass  # Continue even if backend is unavailable
                
                return jsonify({
                    'success': True,
                    'detectedSign': detected_sign,
                    'confidence': round(confidence, 2)
                })
        
        return jsonify({
            'success': False,
            'message': 'No hand detected'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/process-video', methods=['POST'])
def process_video():
    """Process video frame for real-time detection"""
    try:
        data = request.json
        frame_data = data.get('frame')
        
        if not frame_data:
            return jsonify({'success': False, 'message': 'No frame provided'}), 400
        
        # Decode frame
        image_bytes = base64.b64decode(frame_data.split(',')[1] if ',' in frame_data else frame_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Detect landmarks
        results = detector.detect_hand_landmarks(frame)
        
        response_data = {
            'success': True,
            'handDetected': False,
            'detectedSign': None,
            'confidence': 0
        }
        
        if results.multi_hand_landmarks:
            response_data['handDetected'] = True
            hand_landmarks = results.multi_hand_landmarks[0]
            features = detector.extract_features(hand_landmarks)
            detected_sign, confidence = detector.predict_sign(features)
            
            if detected_sign:
                response_data['detectedSign'] = detected_sign
                response_data['confidence'] = round(confidence, 2)
        
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    print('Starting Python AI Service on port 5001...')
    app.run(host='0.0.0.0', port=5001, debug=True)
