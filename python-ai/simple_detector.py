import cv2
import numpy as np

class SimpleGestureDetector:
    def __init__(self):
        # Use OpenCV's hand cascade (simpler, no TensorFlow)
        self.hand_cascade = None
        print("Simple gesture detector initialized (OpenCV only)")
        
    def detect_hand_landmarks(self, frame):
        """Simple hand detection using color and contours"""
        # Convert to HSV for skin detection
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        
        # Skin color range
        lower_skin = np.array([0, 20, 70], dtype=np.uint8)
        upper_skin = np.array([20, 255, 255], dtype=np.uint8)
        
        # Create mask
        mask = cv2.inRange(hsv, lower_skin, upper_skin)
        
        # Find contours
        contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        # Return mock results object
        class Results:
            def __init__(self, has_hand):
                self.multi_hand_landmarks = [True] if has_hand else None
        
        has_hand = len(contours) > 0 and max([cv2.contourArea(c) for c in contours]) > 5000
        return Results(has_hand)
    
    def extract_features(self, hand_landmarks):
        """Return simple features"""
        return np.random.rand(63)  # Mock features
    
    def predict_sign(self, features):
        """Simple random prediction for demo"""
        if features is None:
            return None, 0.0
        
        # Random sign for demo
        signs = ['A', 'B', 'C', 'D', 'V', 'I', '1', '2', '5']
        import random
        sign = random.choice(signs)
        confidence = random.uniform(0.7, 0.9)
        
        return sign, confidence
    
    def release(self):
        """Release resources"""
        pass
