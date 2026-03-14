import cv2
import numpy as np
import os

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
        # Frontend sends frames at a low rate by default; allow tuning without changing logic.
        self.stable_threshold = max(1, int(os.getenv("STABLE_THRESHOLD", "2")))
        
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
    
    def _predict_candidate(self, features):
        if features is None or len(features) < 63:
            return None, 0.0

        # MediaPipe Hands has 21 landmarks; our feature vector is [x,y,z] * 21.
        # Using landmark_id * 3 keeps the intended rule logic correct.
        def _x(landmark_id: int):
            return features[landmark_id * 3]

        def _y(landmark_id: int):
            return features[landmark_id * 3 + 1]

        def _dist(a_id: int, b_id: int):
            dx = _x(a_id) - _x(b_id)
            dy = _y(a_id) - _y(b_id)
            return float((dx * dx + dy * dy) ** 0.5)
        
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

        index_mcp_x = _x(5)
        
        ring_tip_y = _y(16)
        ring_pip_y = _y(14)
        ring_mcp_y = _y(13)
        
        pinky_tip_y = _y(20)
        pinky_pip_y = _y(18)
        pinky_mcp_y = _y(17)
        pinky_tip_x = _x(20)
        
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

        # A few high-signal alphabet gestures that were previously misclassified.
        # L: index up + thumb out, other fingers closed
        if index_up and thumb_up and (not middle_up) and (not ring_up) and (not pinky_up) and index_straight:
            return 'L', 0.90

        # Y: thumb out + pinky up, other fingers closed
        if pinky_up and thumb_up and (not index_up) and (not middle_up) and (not ring_up):
            return 'Y', 0.88

        # C / O: use thumb-index distance when hand is generally open.
        if index_up and middle_up and ring_up and pinky_up:
            thumb_index = _dist(4, 8)
            # Typical webcam normalization: distances are in image-normalized coords.
            if thumb_index < 0.06:
                return 'O', 0.86
            if 0.06 <= thumb_index <= 0.14:
                return 'C', 0.84
        
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
                # Distinguish B vs 4 heuristically:
                # - B: fingers together and thumb tucked across palm
                # - 4: fingers typically more spread
                spread = abs(index_tip_x - pinky_tip_x)
                thumb_near_palm = abs(thumb_tip_x - index_mcp_x) < 0.08
                if spread < 0.22 and thumb_near_palm:
                    detected_sign = 'B'
                    confidence = 0.86
                else:
                    detected_sign = '4'
                    confidence = 0.88
        
        if detected_sign:
            return detected_sign, confidence

        return None, 0.0

    def predict_sign(self, features, require_stable=True):
        """Predict sign from features. If require_stable=True, applies stability gating."""
        candidate_sign, candidate_confidence = self._predict_candidate(features)
        if not require_stable:
            return candidate_sign, candidate_confidence

        if not candidate_sign:
            # Reset stability when nothing is confidently detected.
            self.last_detection = None
            self.detection_count = 0
            return None, 0.0

        if candidate_sign == self.last_detection:
            self.detection_count += 1
        else:
            self.detection_count = 1
            self.last_detection = candidate_sign

        if self.detection_count >= self.stable_threshold:
            print(f"STABLE: {candidate_sign} ({candidate_confidence:.0%})")
            return candidate_sign, candidate_confidence

        print(f"Stabilizing... ({self.detection_count}/{self.stable_threshold})")
        return None, 0.0
    
    def release(self):
        if MEDIAPIPE_AVAILABLE and self.hands:
            self.hands.close()
