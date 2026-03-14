import cv2
import mediapipe as mp
import numpy as np

class GestureDetector:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        self.mp_draw = mp.solutions.drawing_utils
        
    def detect_hand_landmarks(self, frame):
        """Detect hand landmarks in frame"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)
        return results
    
    def draw_landmarks(self, frame, results):
        """Draw hand landmarks on frame"""
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                self.mp_draw.draw_landmarks(
                    frame, 
                    hand_landmarks, 
                    self.mp_hands.HAND_CONNECTIONS
                )
        return frame
    
    def extract_features(self, hand_landmarks):
        """Extract features from hand landmarks"""
        if not hand_landmarks:
            return None
        
        landmarks = hand_landmarks.landmark
        features = []
        
        for landmark in landmarks:
            features.extend([landmark.x, landmark.y, landmark.z])
        
        return np.array(features)
    
    def predict_sign(self, features):
        """Predict sign from features (improved rule-based)"""
        if features is None:
            return None, 0.0
        
        # Get landmark positions
        wrist = features[0:3]
        thumb_tip = features[12:15]
        thumb_ip = features[9:12]
        index_tip = features[24:27]
        index_pip = features[18:21]
        # Landmark ids: 0 wrist, 4 thumb_tip, 8 index_tip, 12 middle_tip, 16 ring_tip, 20 pinky_tip
        middle_tip = features[36:39]
        middle_pip = features[30:33]
        ring_tip = features[48:51]
        ring_pip = features[42:45]
        pinky_tip = features[60:63]
        pinky_pip = features[54:57]
        
        # Count extended fingers
        extended = self._count_extended_fingers(features)
        
        # Detect specific gestures
        
        # Closed fist (A, S, M, N, T)
        if extended == 0:
            # Check thumb position for variations
            if thumb_tip[0] > index_pip[0]:  # Thumb on side
                return 'A', 0.85
            else:
                return 'S', 0.80
        
        # One finger extended
        elif extended == 1:
            # Check which finger is extended
            if index_tip[1] < index_pip[1]:  # Index up
                return 'D', 0.82
            elif pinky_tip[1] < pinky_pip[1]:  # Pinky up
                return 'I', 0.80
            else:
                return '1', 0.78
        
        # Two fingers extended
        elif extended == 2:
            index_up = index_tip[1] < index_pip[1]
            middle_up = middle_tip[1] < middle_pip[1]
            
            if index_up and middle_up:
                # Check spacing for V vs U
                spacing = abs(index_tip[0] - middle_tip[0])
                if spacing > 0.08:
                    return 'V', 0.85
                else:
                    return 'U', 0.82
            return '2', 0.75
        
        # Three fingers extended
        elif extended == 3:
            return 'W', 0.83
        
        # Four fingers extended
        elif extended == 4:
            return '4', 0.80
        
        # All fingers extended
        elif extended == 5:
            # Check if fingers are spread (B) or together (5)
            finger_spread = abs(index_tip[0] - pinky_tip[0])
            if finger_spread > 0.15:
                return '5', 0.85
            else:
                return 'B', 0.82
        
        return None, 0.0
    
    def _count_extended_fingers(self, features):
        """Count number of extended fingers with improved logic"""
        count = 0
        
        # Thumb - check if extended horizontally
        thumb_tip_x = features[12]
        thumb_ip_x = features[9]
        if abs(thumb_tip_x - thumb_ip_x) > 0.05:
            count += 1
        
        # Other fingers - check if tip is above PIP joint
        # Base indices in the feature vector (x at idx, y at idx+1, z at idx+2)
        finger_tips = [24, 36, 48, 60]  # Index, Middle, Ring, Pinky tips
        finger_pips = [18, 30, 42, 54]  # Index, Middle, Ring, Pinky PIP joints
        
        for tip_idx, pip_idx in zip(finger_tips, finger_pips):
            # Y-coordinate: lower value = higher position
            if features[tip_idx + 1] < features[pip_idx + 1] - 0.03:
                count += 1
        
        return count
    
    def release(self):
        """Release resources"""
        self.hands.close()
