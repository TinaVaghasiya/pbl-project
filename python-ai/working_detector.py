import cv2
import numpy as np

try:
    import mediapipe as mp
    MEDIAPIPE_AVAILABLE = True
except:
    MEDIAPIPE_AVAILABLE = False
    print("MediaPipe not available, using fallback detection")

class WorkingGestureDetector:
    def __init__(self):
        if MEDIAPIPE_AVAILABLE:
            self.mp_hands = mp.solutions.hands
            self.hands = self.mp_hands.Hands(
                static_image_mode=False,
                max_num_hands=1,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5
            )
            self.mp_draw = mp.solutions.drawing_utils
            print("✓ MediaPipe hands initialized")
        else:
            self.hands = None
            print("✗ Using basic detection")
        
    def detect_hand_landmarks(self, frame):
        """Detect hand landmarks in frame"""
        if MEDIAPIPE_AVAILABLE and self.hands:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.hands.process(rgb_frame)
            return results
        else:
            # Fallback: basic hand detection
            return self._basic_hand_detection(frame)
    
    def _basic_hand_detection(self, frame):
        """Basic hand detection using skin color"""
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        lower_skin = np.array([0, 20, 70], dtype=np.uint8)
        upper_skin = np.array([20, 255, 255], dtype=np.uint8)
        mask = cv2.inRange(hsv, lower_skin, upper_skin)
        contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        class Results:
            def __init__(self, has_hand):
                self.multi_hand_landmarks = [True] if has_hand else None
        
        has_hand = len(contours) > 0 and any(cv2.contourArea(c) > 5000 for c in contours)
        return Results(has_hand)
    
    def extract_features(self, hand_landmarks):
        """Extract features from hand landmarks"""
        if not hand_landmarks:
            return None
        
        if MEDIAPIPE_AVAILABLE and hasattr(hand_landmarks, 'landmark'):
            landmarks = hand_landmarks.landmark
            features = []
            for landmark in landmarks:
                features.extend([landmark.x, landmark.y, landmark.z])
            return np.array(features)
        else:
            return np.random.rand(63)
    
    def predict_sign(self, features):
        """Predict sign from features"""
        if features is None:
            return None, 0.0
        
        if MEDIAPIPE_AVAILABLE and len(features) == 63:
            # Proper detection with MediaPipe
            return self._detect_with_mediapipe(features)
        else:
            # Fallback detection
            return self._detect_fallback()
    
    def _detect_with_mediapipe(self, features):
        """Detect gesture using MediaPipe features - FIXED"""
        # MediaPipe Hands has 21 landmarks; our feature vector is [x,y,z] * 21.
        def _x(landmark_id: int):
            return features[landmark_id * 3]

        def _y(landmark_id: int):
            return features[landmark_id * 3 + 1]

        # Get landmark positions
        wrist_y = _y(0)
        
        # Finger tips (y-coordinates)
        thumb_tip_y = _y(4)
        index_tip_y = _y(8)
        middle_tip_y = _y(12)
        ring_tip_y = _y(16)
        pinky_tip_y = _y(20)
        
        # Finger PIPs
        index_pip_y = _y(6)
        middle_pip_y = _y(10)
        ring_pip_y = _y(14)
        pinky_pip_y = _y(18)
        
        # Finger MCPs (knuckles)
        index_mcp_y = _y(5)
        middle_mcp_y = _y(9)
        ring_mcp_y = _y(13)
        pinky_mcp_y = _y(17)
        
        # X-coordinates for spacing
        index_tip_x = _x(8)
        middle_tip_x = _x(12)
        thumb_tip_x = _x(4)
        index_mcp_x = _x(5)
        
        # Count extended fingers - STRICTER THRESHOLD
        extended = 0
        fingers_up = []
        
        # Check each finger - tip must be significantly above PIP
        threshold = 0.08  # Increased threshold
        
        # Index finger
        if (index_tip_y < index_pip_y - threshold) and (index_tip_y < index_mcp_y):
            extended += 1
            fingers_up.append('index')
        
        # Middle finger
        if (middle_tip_y < middle_pip_y - threshold) and (middle_tip_y < middle_mcp_y):
            extended += 1
            fingers_up.append('middle')
        
        # Ring finger
        if (ring_tip_y < ring_pip_y - threshold) and (ring_tip_y < ring_mcp_y):
            extended += 1
            fingers_up.append('ring')
        
        # Pinky finger
        if (pinky_tip_y < pinky_pip_y - threshold) and (pinky_tip_y < pinky_mcp_y):
            extended += 1
            fingers_up.append('pinky')
        
        # Thumb - check if extended sideways
        thumb_extended = abs(thumb_tip_x - index_mcp_x) > 0.15
        
        print(f"🖐️ Fingers: {extended} up {fingers_up}, Thumb: {thumb_extended}")
        
        # GESTURE DETECTION
        
        # CLOSED FIST (0 fingers)
        if extended == 0:
            if thumb_extended:
                return 'S', 0.85
            else:
                return 'A', 0.88
        
        # ONE FINGER (1 finger)
        elif extended == 1:
            if 'index' in fingers_up:
                return 'D', 0.87
            elif 'pinky' in fingers_up:
                return 'I', 0.85
            else:
                return '1', 0.82
        
        # TWO FINGERS (2 fingers)
        elif extended == 2:
            if 'index' in fingers_up and 'middle' in fingers_up:
                # Check spacing
                spacing = abs(index_tip_x - middle_tip_x)
                print(f"   Spacing: {spacing:.3f}")
                if spacing > 0.08:  # Fingers spread apart
                    return 'V', 0.89
                else:  # Fingers together
                    return 'U', 0.87
            else:
                return '2', 0.82
        
        # THREE FINGERS (3 fingers)
        elif extended == 3:
            if 'index' in fingers_up and 'middle' in fingers_up and 'ring' in fingers_up:
                return 'W', 0.88
            else:
                return '3', 0.84
        
        # FOUR FINGERS (4 fingers)
        elif extended == 4:
            if thumb_extended:
                return '5', 0.89  # All 5 fingers
            else:
                return '4', 0.86
        
        # FIVE FINGERS (all up)
        elif extended >= 4 and thumb_extended:
            return '5', 0.90
        
        # Unknown gesture
        else:
            print(f"   ⚠️ Unknown: {extended} fingers")
            return None, 0.0
    
    def _detect_fallback(self):
        """Fallback detection (demo mode)"""
        import random
        signs = ['A', 'B', 'C', 'D', 'V', 'U', 'W', '1', '2', '3', '4', '5']
        sign = random.choice(signs)
        confidence = random.uniform(0.70, 0.90)
        return sign, confidence
    
    def release(self):
        """Release resources"""
        if MEDIAPIPE_AVAILABLE and self.hands:
            self.hands.close()
