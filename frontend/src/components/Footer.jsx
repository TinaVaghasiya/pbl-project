import { Link } from 'react-router-dom';
import { Hand, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Hand className="w-6 h-6 text-primary" />
              <span className="text-lg font-bold text-primary">Smart Sign</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              AI-powered sign language interpreter helping bridge communication gaps between deaf and hearing communities.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-600 dark:text-gray-400 hover:text-primary text-sm">Home</Link>
              <Link to="/learning" className="block text-gray-600 dark:text-gray-400 hover:text-primary text-sm">Learning</Link>
              <Link to="/text-to-sign" className="block text-gray-600 dark:text-gray-400 hover:text-primary text-sm">Text to Sign</Link>
              <Link to="/about" className="block text-gray-600 dark:text-gray-400 hover:text-primary text-sm">About</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t dark:border-gray-700 mt-8 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Smart Sign Language Interpreter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
