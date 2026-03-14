import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Trash2, Copy, Check } from 'lucide-react';
import { processVideoFrame } from '../utils/api';

const SignToText = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const [currentSign, setCurrentSign] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        startDetection();
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const startDetection = () => {
    intervalRef.current = setInterval(() => {
      captureAndDetect();
    }, 1000);
  };

  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const frameData = canvas.toDataURL('image/jpeg', 0.8);

    try {
      const response = await processVideoFrame(frameData);
      if (response.data.success && response.data.detectedSign) {
        const sign = response.data.detectedSign;
        setCurrentSign(sign);
        setConfidence(response.data.confidence);
        
        // Add to detected text if confidence is high enough
        if (response.data.confidence > 0.7) {
          setDetectedText(prev => prev + sign);
        }
      }
    } catch (error) {
      console.error('Detection error:', error);
    }
  };

  const handleClear = () => {
    setDetectedText('');
    setCurrentSign(null);
    setConfidence(0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(detectedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Camera className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sign to Text</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Use your webcam to detect and translate sign language in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Camera Feed</h2>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
              {error ? (
                <div className="absolute inset-0 flex items-center justify-center text-red-500 p-4 text-center">
                  {error}
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
                      <div className="text-center text-white">
                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Camera is off</p>
                      </div>
                    </div>
                  )}
                  {currentSign && isActive && (
                    <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg font-bold text-2xl shadow-lg">
                      {currentSign}
                      <span className="text-sm ml-2">
                        {Math.round(confidence * 100)}%
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="flex gap-3">
              {!isActive ? (
                <button onClick={startCamera} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Camera className="w-5 h-5" />
                  Start Camera
                </button>
              ) : (
                <button onClick={stopCamera} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                  <CameraOff className="w-5 h-5" />
                  Stop Camera
                </button>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Detected Text</h2>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 min-h-64 mb-4">
              {detectedText ? (
                <p className="text-2xl font-mono break-words">{detectedText}</p>
              ) : (
                <p className="text-gray-400 text-center mt-20">
                  Detected signs will appear here...
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClear}
                disabled={!detectedText}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5" />
                Clear
              </button>
              <button
                onClick={handleCopy}
                disabled={!detectedText}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Text
                  </>
                )}
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold mb-2 text-primary">How to use:</h3>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Click "Start Camera" to begin detection</li>
                <li>• Show sign language gestures to the camera</li>
                <li>• Detected letters will appear automatically</li>
                <li>• Hold each gesture for 1-2 seconds</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignToText;
