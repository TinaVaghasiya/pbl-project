# Sign to Text Testing Guide

## ✅ How to Test Sign Detection

### **Step 1: Make Sure All Services Are Running**

Check that these are running:
- ✓ Backend on port 5002
- ✓ Python AI on port 5001
- ✓ Frontend on port 5174

### **Step 2: Test Python AI Directly (Optional)**

```bash
cd C:\SignDetection\python-ai
python test_detection.py
```

This will:
- Open your webcam
- Show real-time hand detection
- Display detected signs on screen
- Press 'q' to quit

### **Step 3: Test in Browser**

1. Open: http://localhost:5174/sign-to-text
2. Click "Start Camera"
3. Allow camera permissions
4. Show hand gestures to camera

## 🖐️ Supported Gestures

### **Currently Detected Signs:**

| Gesture | Description | Fingers Extended |
|---------|-------------|------------------|
| **A** | Closed fist, thumb on side | 0 |
| **S** | Closed fist, thumb across | 0 |
| **D** | Index finger pointing up | 1 |
| **I** | Pinky finger up | 1 |
| **1** | Index finger up | 1 |
| **U** | Index & middle together | 2 |
| **V** | Index & middle apart (peace sign) | 2 |
| **2** | Two fingers up | 2 |
| **W** | Three fingers up | 3 |
| **4** | Four fingers up | 4 |
| **B** | All fingers together | 5 |
| **5** | All fingers spread | 5 |

## 📋 Testing Checklist

### **Basic Tests:**
- [ ] Camera starts successfully
- [ ] Video feed is visible
- [ ] Hand is detected (landmarks visible)
- [ ] Sign appears in top-right corner
- [ ] Confidence percentage shows
- [ ] Detected text accumulates
- [ ] Clear button works
- [ ] Copy button works
- [ ] Stop camera works

### **Gesture Tests:**

Try these gestures:

1. **Closed Fist (A)**
   - Make a fist with thumb on the side
   - Should detect: A

2. **Peace Sign (V)**
   - Index and middle finger apart
   - Should detect: V

3. **Open Hand (5)**
   - All fingers spread wide
   - Should detect: 5

4. **Pointing (D or 1)**
   - Index finger pointing up
   - Should detect: D or 1

## 🔧 Troubleshooting

### **Camera Not Starting**
```
Error: Camera access denied
```
**Solution:**
- Allow camera permissions in browser
- Use Chrome or Edge (recommended)
- Check if another app is using camera

### **No Hand Detected**
```
No hand detected message
```
**Solution:**
- Ensure good lighting
- Keep hand in center of frame
- Show full hand to camera
- Move closer to camera

### **Wrong Sign Detected**
```
Detects wrong letter
```
**Solution:**
- Hold gesture steady for 2 seconds
- Make gesture more clearly
- Check hand position matches ASL
- Improve lighting conditions

### **Low Confidence**
```
Confidence below 70%
```
**Solution:**
- Make clearer gestures
- Hold position longer
- Improve lighting
- Reduce background clutter

### **Detection Too Slow**
```
Laggy or delayed
```
**Solution:**
- Close other applications
- Reduce video quality
- Check Python service is running
- Restart services

## 🎯 Tips for Best Results

### **Lighting:**
- Use bright, even lighting
- Avoid backlighting
- No shadows on hand

### **Hand Position:**
- Center of frame
- 1-2 feet from camera
- Show full hand clearly
- Keep hand steady

### **Background:**
- Plain background
- No clutter
- Contrasting color

### **Gestures:**
- Hold for 1-2 seconds
- Make clear, distinct shapes
- Follow ASL standards
- Practice each sign

## 📊 Expected Performance

### **Detection Rate:**
- Good conditions: 80-90%
- Average conditions: 60-80%
- Poor conditions: 40-60%

### **Accuracy:**
- Clear gestures: 85%+
- Average gestures: 70-85%
- Unclear gestures: <70%

### **Speed:**
- Detection interval: 1 second
- Response time: <100ms
- Frame rate: ~1 FPS

## 🔍 Debug Mode

### **Check Python AI Logs:**

Look at the Python AI terminal for:
```
Hand detected: True
Detected sign: A
Confidence: 0.85
```

### **Check Browser Console:**

Press F12 and look for:
```
Detection response: {success: true, detectedSign: "A", confidence: 0.85}
```

### **Check Backend Logs:**

Look for:
```
POST /api/sign-to-text
Detected sign: A, Confidence: 0.85
```

## ✨ Advanced Testing

### **Test Multiple Signs:**

Try spelling words:
- "HI" → Show H, then I
- "OK" → Show O, then K
- "YES" → Show Y, E, S

### **Test Numbers:**

Count 1-5:
- Show 1 finger
- Show 2 fingers
- Show 3 fingers
- Show 4 fingers
- Show 5 fingers

### **Test Speed:**

- Quick gestures (should not detect)
- Slow gestures (should detect)
- Held gestures (should detect once)

## 📝 Report Issues

If detection isn't working:

1. **Check all services are running**
2. **Test with test_detection.py**
3. **Check browser console for errors**
4. **Verify camera permissions**
5. **Try different gestures**
6. **Check lighting conditions**

## 🎓 Learning Resources

To learn proper ASL signs:
- https://www.signingsavvy.com/
- https://www.lifeprint.com/
- https://www.startasl.com/

Practice each sign before testing!
