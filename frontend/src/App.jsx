import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './utils/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Learning from './pages/Learning';
import TextToSign from './pages/TextToSign';
import SignToText from './pages/SignToText';
import VoiceToText from './pages/VoiceToText';
import About from './pages/About';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/learning" element={<Learning />} />
              <Route path="/text-to-sign" element={<TextToSign />} />
              <Route path="/sign-to-text" element={<SignToText />} />
              <Route path="/voice-to-text" element={<VoiceToText />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
