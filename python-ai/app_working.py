from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import base64
import numpy as np
from working_detector import WorkingGestureDetector

app = Flask(__name__)
CORS(app)

print("=" * 60)
print("Initializing gesture detector...")
detector = WorkingGestureDetector()
print("Detector ready!")
print("=" * 60)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'success': True, 'message': 'Python AI service is running'})

@app.route('/api/process-video', methods=['POST'])
def process_video():
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
                print(f"Detected: {detected_sign} ({confidence:.2%})")
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    print('\nPython AI Service Starting...')
    print('Running on: http://localhost:5001')
    print('Press Ctrl+C to stop\n')
    app.run(host='0.0.0.0', port=5001, debug=False, use_reloader=False)
