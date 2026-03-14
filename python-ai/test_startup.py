import sys
print("Python version:", sys.version)
print("=" * 60)

print("\nChecking imports...")

try:
    import flask
    print("✓ Flask imported successfully")
except Exception as e:
    print(f"✗ Flask import failed: {e}")

try:
    import flask_cors
    print("✓ Flask-CORS imported successfully")
except Exception as e:
    print(f"✗ Flask-CORS import failed: {e}")

try:
    import cv2
    print("✓ OpenCV imported successfully")
except Exception as e:
    print(f"✗ OpenCV import failed: {e}")

try:
    import mediapipe
    print("✓ MediaPipe imported successfully")
except Exception as e:
    print(f"✗ MediaPipe import failed: {e}")

try:
    import numpy
    print("✓ NumPy imported successfully")
except Exception as e:
    print(f"✗ NumPy import failed: {e}")

try:
    import requests
    print("✓ Requests imported successfully")
except Exception as e:
    print(f"✗ Requests import failed: {e}")

print("\n" + "=" * 60)
print("Testing gesture detector...")

try:
    from gesture_detector import GestureDetector
    print("✓ GestureDetector imported successfully")
    
    detector = GestureDetector()
    print("✓ GestureDetector initialized successfully")
except Exception as e:
    print(f"✗ GestureDetector failed: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
print("Testing Flask app...")

try:
    from app import app
    print("✓ Flask app imported successfully")
    
    print("\nStarting Flask server...")
    print("If you see this, the app should start below:")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=5001, debug=False)
    
except Exception as e:
    print(f"✗ Flask app failed: {e}")
    import traceback
    traceback.print_exc()
