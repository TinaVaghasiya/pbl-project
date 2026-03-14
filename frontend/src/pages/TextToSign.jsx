import { useState } from 'react';
import { Type, Play, RotateCcw } from 'lucide-react';
import Loading from '../components/common/Loading';
import { convertTextToSign } from '../utils/api';

const TextToSign = () => {
  const [text, setText] = useState('');
  const [signs, setSigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleConvert = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      const response = await convertTextToSign(text);
      setSigns(response.data.data);
      setCurrentIndex(0);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error converting text:', error);
      alert('Failed to convert text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setCurrentIndex(0);
    playSequence(0);
  };

  const playSequence = (index) => {
    if (index >= signs.length) {
      setIsPlaying(false);
      return;
    }

    setCurrentIndex(index);
    setTimeout(() => {
      playSequence(index + 1);
    }, 1500);
  };

  const handleReset = () => {
    setText('');
    setSigns([]);
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Type className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Text to Sign</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Convert any text into sign language animations
          </p>
        </div>

        {/* Input Section */}
        <div className="card mb-8">
          <label className="block text-lg font-semibold mb-3">Enter Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here..."
            className="input-field min-h-32 resize-none"
            maxLength={100}
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">{text.length}/100 characters</span>
            <div className="flex gap-3">
              <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleConvert}
                disabled={!text.trim() || loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Type className="w-4 h-4" />
                Convert
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && <Loading message="Converting text to signs..." />}

        {/* Results Section */}
        {!loading && signs.length > 0 && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Sign Sequence</h2>
              <button
                onClick={handlePlay}
                disabled={isPlaying}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                {isPlaying ? 'Playing...' : 'Play Animation'}
              </button>
            </div>

            {/* Current Sign Display */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-12 mb-6 flex flex-col items-center justify-center min-h-64">
              {signs[currentIndex] && (
                <div className="text-center">
                  <div className="w-48 h-48 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                    {signs[currentIndex].image ? (
                      <img
                        src={signs[currentIndex].image}
                        alt={signs[currentIndex].letter}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <span className="text-9xl font-bold text-white">
                        {signs[currentIndex].letter}
                      </span>
                    )}
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">
                    {signs[currentIndex].letter}
                  </h3>
                  <p className="text-white/80">{signs[currentIndex].description}</p>
                </div>
              )}
            </div>

            {/* Sign Sequence Timeline */}
            <div className="flex flex-wrap gap-3 justify-center">
              {signs.map((sign, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-16 h-16 rounded-lg font-bold text-xl transition-all ${
                    index === currentIndex
                      ? 'bg-primary text-white scale-110 shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {sign.letter}
                </button>
              ))}
            </div>

            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Showing sign {currentIndex + 1} of {signs.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToSign;
