import cv2
import numpy as np

try:
    import mediapipe as mp
    MEDIAPIPE_AVAILABLE = True
except:
    MEDIAPIPE_AVAILABLE = False

class ImprovedGestureDetector:
    def __init__(self):
        if MEDIAPIPE_AVAILABLE:
            self.mp_hands = mp.solutions.hands
            self.hands = self.mp_hands.Hands(
                static_image_mode=False,
                max_num_hands=1,
                min_detection_confidence=0.7,
                min_tracking_confidence=0.7
            )
            self.mp_draw = mp.solutions.drawing_utils
            print("MediaPipe initialized with high confidence")
        else:
            self.hands = None
            print("MediaPipe not available - gesture detection disabled")
        
        self.last_detection = None
        self.detection_count = 0
        self.stable_threshold = 3
        
    def detect_hand_landmarks(self, frame):
        if MEDIAPIPE_AVAILABLE and self.hands:
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.hands.process(rgb_frame)
            return results
        return None
    
    def extract_features(self, hand_landmarks):
        if not hand_landmarks or not hasattr(hand_landmarks, 'landmark'):
            return None
        
        landmarks = hand_landmarks.landmark
        features = []
        for landmark in landmarks:
            features.extend([landmark.x, landmark.y, landmark.z])
        return np.array(features)
    
    def is_finger_extended(self, tip_y, pip_y, mcp_y, wrist_y):
        # Simpler check - just tip above PIP
        tip_above_pip = tip_y < pip_y - 0.05
        return tip_above_pip
    
    def predict_sign(self, features):
        if features is None or len(features) < 63:
            return None, 0.0

        # MediaPipe Hands has 21 landmarks; our feature vector is [x,y,z] * 21.
        # Using landmark_id * 3 keeps the intended rule logic correct.
        def _x(landmark_id: int):
            return features[landmark_id * 3]

        def _y(landmark_id: int):
            return features[landmark_id * 3 + 1]
        
        wrist_y = _y(0)
        
        thumb_tip_x = _x(4)
        thumb_tip_y = _y(4)
        
        index_tip_y = _y(8)
        index_pip_y = _y(6)
        index_mcp_y = _y(5)
        index_tip_x = _x(8)
        
        middle_tip_y = _y(12)
        middle_pip_y = _y(10)
        middle_mcp_y = _y(9)
        middle_tip_x = _x(12)
        
        ring_tip_y = _y(16)
        ring_pip_y = _y(14)
        ring_mcp_y = _y(13)
        
        pinky_tip_y = _y(20)
        pinky_pip_y = _y(18)
        pinky_mcp_y = _y(17)
        
        index_up = self.is_finger_extended(index_tip_y, index_pip_y, index_mcp_y, wrist_y)
        middle_up = self.is_finger_extended(middle_tip_y, middle_pip_y, middle_mcp_y, wrist_y)
        ring_up = self.is_finger_extended(ring_tip_y, ring_pip_y, ring_mcp_y, wrist_y)
        pinky_up = self.is_finger_extended(pinky_tip_y, pinky_pip_y, pinky_mcp_y, wrist_y)
        
        # Thumb detection - must be far from palm
        thumb_up = abs(thumb_tip_x - index_tip_x) > 0.15  # Increased from 0.12
        
        # Additional check - fingers must be reasonably straight
        index_straight = index_tip_y < index_mcp_y - 0.08
        middle_straight = middle_tip_y < middle_mcp_y - 0.08
        
        fingers = []
        if index_up:
            fingers.append('INDEX')
        if middle_up:
            fingers.append('MIDDLE')
        if ring_up:
            fingers.append('RING')
        if pinky_up:
            fingers.append('PINKY')
        if thumb_up:
            fingers.append('THUMB')
        
        extended_count = len([f for f in [index_up, middle_up, ring_up, pinky_up] if f])
        
        # Debug output with middle finger details
        print("=" * 50)
        print(f"Fingers UP: {fingers}")
        print(f"Count: {extended_count} + Thumb: {thumb_up}")
        print(f"Index straight: {index_straight}, Middle straight: {middle_straight}")
        print(f"Index tip Y: {index_tip_y:.3f}, PIP Y: {index_pip_y:.3f}, Diff: {index_pip_y - index_tip_y:.3f}")
        print(f"Middle tip Y: {middle_tip_y:.3f}, PIP Y: {middle_pip_y:.3f}, Diff: {middle_pip_y - middle_tip_y:.3f}")
        print("=" * 50)
        
        detected_sign = None
        confidence = 0.0
        
        if extended_count == 0:
            if thumb_up:
                detected_sign = 'THUMBS_UP'
                confidence = 0.90
            else:
                detected_sign = 'A'
                confidence = 0.92
        
        elif extended_count == 1:
            # Only detect if finger is VERY straight
            if index_up and index_straight:
                detected_sign = 'D'
                confidence = 0.90
            elif pinky_up:
                detected_sign = 'I'
                confidence = 0.88
            else:
                # Don't detect if not clear
                return None, 0.0
        
        elif extended_count == 2:
            # Require both fingers to be straight
            if index_up and middle_up and index_straight and middle_straight:
                spacing = abs(index_tip_x - middle_tip_x)
                print(f"Finger spacing: {spacing:.3f}")
                
                if spacing > 0.08:  # Increased threshold
                    detected_sign = 'V'
                    confidence = 0.91
                else:
                    detected_sign = 'U'
                    confidence = 0.89
            else:
                # Not clear enough
                return None, 0.0
        
        elif extended_count == 3:
            if index_up and middle_up and ring_up:
                detected_sign = 'W'
                confidence = 0.90
            else:
                detected_sign = '3'
                confidence = 0.85
        
        elif extended_count == 4:
            if thumb_up:
                detected_sign = '5'
                confidence = 0.93
            else:
                detected_sign = '4'
                confidence = 0.88
        
        if detected_sign:
            if detected_sign == self.last_detection:
                self.detection_count += 1
            else:
                self.detection_count = 1
                self.last_detection = detected_sign
            
            if self.detection_count >= self.stable_threshold:
                print(f"STABLE: {detected_sign} ({confidence:.0%})")
                return detected_sign, confidence
            else:
                print(f"Stabilizing... ({self.detection_count}/{self.stable_threshold})")
                return None, 0.0
        
        return None, 0.0
    
    def release(self):
        if MEDIAPIPE_AVAILABLE and self.hands:
            self.hands.close()
