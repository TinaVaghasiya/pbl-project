import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Copy, Trash2, Check } from 'lucide-react';

const VoiceToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcriptPart + ' ';
        } else {
          interim += transcriptPart;
        }
      }

      if (final) {
        setTranscript(prev => prev + final);
      }
      setInterimTranscript(interim);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permissions.');
      } else {
        setError('An error occurred. Please try again.');
      }
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setError('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleClear = () => {
    setTranscript('');
    setInterimTranscript('');
    setError('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Mic className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Voice to Text</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Convert your speech to text using voice recognition
          </p>
        </div>

        {/* Microphone Control */}
        <div className="card mb-8">
          <div className="flex flex-col items-center">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={!!error && error.includes('not supported')}
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-primary hover:bg-blue-600'
              } disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl`}
            >
              {isListening ? (
                <MicOff className="w-16 h-16 text-white" />
              ) : (
                <Mic className="w-16 h-16 text-white" />
              )}
            </button>
            <p className="mt-6 text-lg font-semibold">
              {isListening ? 'Listening...' : 'Click to start speaking'}
            </p>
            {error && (
              <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
            )}
          </div>
        </div>

        {/* Transcript Display */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Transcript</h2>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 min-h-64 mb-4">
            {transcript || interimTranscript ? (
              <div className="text-lg">
                <span>{transcript}</span>
                <span className="text-gray-400 italic">{interimTranscript}</span>
              </div>
            ) : (
              <p className="text-gray-400 text-center mt-20">
                Your transcript will appear here...
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleClear}
              disabled={!transcript}
              className="btn-secondary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-5 h-5" />
              Clear
            </button>
            <button
              onClick={handleCopy}
              disabled={!transcript}
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
            <h3 className="font-semibold mb-2 text-primary">Tips for best results:</h3>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Minimize background noise</li>
              <li>• Allow microphone access when prompted</li>
              <li>• Use Chrome or Edge for best compatibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceToText;
