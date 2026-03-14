import cv2
from gesture_detector import GestureDetector
import time

print("Testing Sign Detection...")
print("=" * 60)

# Initialize detector
detector = GestureDetector()
print("✓ Gesture detector initialized")

# Open webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("✗ Error: Cannot open camera")
    exit()

print("✓ Camera opened successfully")
print("\nStarting detection... Press 'q' to quit")
print("-" * 60)

frame_count = 0
detection_count = 0

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            print("✗ Error reading frame")
            break
        
        frame_count += 1
        
        # Detect hand landmarks
        results = detector.detect_hand_landmarks(frame)
        
        # Draw landmarks
        frame = detector.draw_landmarks(frame, results)
        
        # Predict sign
        if results.multi_hand_landmarks:
            hand_landmarks = results.multi_hand_landmarks[0]
            features = detector.extract_features(hand_landmarks)
            detected_sign, confidence = detector.predict_sign(features)
            
            if detected_sign:
                detection_count += 1
                # Display on frame
                cv2.putText(frame, f"{detected_sign} ({confidence:.2f})", 
                           (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 
                           1.5, (0, 255, 0), 3)
                
                # Print to console
                if frame_count % 30 == 0:  # Print every 30 frames
                    print(f"Detected: {detected_sign} (Confidence: {confidence:.2%})")
        else:
            cv2.putText(frame, "No hand detected", 
                       (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 
                       1, (0, 0, 255), 2)
        
        # Show frame
        cv2.imshow('Sign Detection Test', frame)
        
        # Quit on 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

except KeyboardInterrupt:
    print("\n\nTest interrupted by user")

finally:
    # Cleanup
    cap.release()
    cv2.destroyAllWindows()
    detector.release()
    
    print("\n" + "=" * 60)
    print("Test Summary:")
    print(f"  Total frames: {frame_count}")
    print(f"  Detections: {detection_count}")
    print(f"  Detection rate: {(detection_count/frame_count*100):.1f}%")
    print("=" * 60)
    print("\n✓ Test completed successfully!")
