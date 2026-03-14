import { Link } from 'react-router-dom';
import { Type, Hand, Mic, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Type,
      title: 'Text to Sign',
      description: 'Convert any text into sign language animations instantly',
      link: '/text-to-sign',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Hand,
      title: 'Sign to Text',
      description: 'Use your webcam to detect and translate sign language to text',
      link: '/sign-to-text',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Mic,
      title: 'Voice to Text',
      description: 'Convert speech to text using voice recognition technology',
      link: '/voice-to-text',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: BookOpen,
      title: 'Learning Module',
      description: 'Learn sign language alphabets, numbers, and common words',
      link: '/learning',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-purple-500 to-secondary py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto text-center text-white z-10">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-16 h-16 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Smart Sign Language Interpreter
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Breaking communication barriers with AI-powered sign language recognition and translation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/learning" className="btn-primary bg-white text-primary hover:bg-gray-100">
              Start Learning
              <ArrowRight className="inline ml-2 w-5 h-5" />
            </Link>
            <Link to="/sign-to-text" className="btn-secondary bg-white/20 hover:bg-white/30 backdrop-blur-sm">
              Try Detection
            </Link>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Everything you need to communicate effectively with sign language
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="card group hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-primary font-semibold">
                  Explore <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Sign Language Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">What is Sign Language?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Sign language is a visual language that uses hand gestures, facial expressions, and body movements to communicate. It's the primary language for many deaf and hard-of-hearing individuals worldwide.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Our AI-powered platform makes it easier than ever to learn and use sign language, helping bridge the communication gap between deaf and hearing communities.
              </p>
              <Link to="/about" className="btn-primary inline-flex items-center">
                Learn More <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 text-white">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Hand className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Real-time Detection</h3>
                    <p className="text-white/80 text-sm">Advanced AI recognizes hand gestures instantly</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Interactive Learning</h3>
                    <p className="text-white/80 text-sm">Learn at your own pace with visual guides</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Easy to Use</h3>
                    <p className="text-white/80 text-sm">Intuitive interface for everyone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
