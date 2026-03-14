import { Code, Database, Brain, Palette, Server, Smartphone } from 'lucide-react';

const About = () => {
  const technologies = [
    {
      icon: Palette,
      title: 'Frontend',
      items: ['React.js with Vite', 'TailwindCSS', 'React Router', 'Axios'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Server,
      title: 'Backend',
      items: ['Node.js', 'Express.js', 'REST API', 'MVC Architecture'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Brain,
      title: 'AI/ML',
      items: ['Python', 'OpenCV', 'MediaPipe', 'Flask'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Database,
      title: 'Database',
      items: ['MongoDB', 'Mongoose ODM', 'Cloud Storage'],
      color: 'from-orange-500 to-red-500'
    }
  ];

  const features = [
    'Real-time sign language detection using AI',
    'Text to sign language conversion',
    'Voice to text transcription',
    'Interactive learning'
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About This Project</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
            A comprehensive AI-powered platform designed to bridge communication gaps and make sign language accessible to everyone
          </p>
        </div>

        {/* Purpose Section */}
        <div className="card mb-12">
          <h2 className="text-3xl font-bold mb-6">Our Purpose</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Communication is a fundamental human right, yet millions of deaf and hard-of-hearing individuals face daily barriers in expressing themselves and understanding others. Our Smart Sign Language Interpreter aims to break down these barriers using cutting-edge artificial intelligence and computer vision technology.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This platform serves multiple purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
            <li>Enable real-time communication between deaf and hearing individuals</li>
            <li>Provide an accessible learning platform for sign language education</li>
            <li>Demonstrate the power of AI in solving real-world accessibility challenges</li>
            <li>Create awareness about the deaf community and their communication needs</li>
          </ul>
        </div>

        {/* Technology Stack */}
        {/* <div className="mb-12"> */}
          {/* <h2 className="text-3xl font-bold mb-8 text-center">Technology Stack</h2> */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <div key={index} className="card">
                <div className={`w-16 h-16 bg-gradient-to-br ${tech.color} rounded-lg flex items-center justify-center mb-4`}>
                  <tech.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{tech.title}</h3>
                <ul className="space-y-2">
                  {tech.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div> */}

        {/* Features */}
        <div className="card mb-12">
          <h2 className="text-3xl font-bold mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture */}
        {/* <div className="card mb-12">
          <h2 className="text-3xl font-bold mb-6">System Architecture</h2>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Frontend Layer</h3>
              <p>Built with React.js and Vite for fast development and optimal performance. TailwindCSS provides a modern, responsive UI with dark mode support.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Backend Layer</h3>
              <p>Node.js with Express.js handles API requests using MVC architecture. RESTful endpoints manage data flow between frontend and database.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">AI Service Layer</h3>
              <p>Python-based microservice uses OpenCV and MediaPipe for hand landmark detection and gesture recognition. Flask API enables seamless integration.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Database Layer</h3>
              <p>MongoDB stores learning materials, user data, and gesture logs with flexible schema design for scalability.</p>
            </div>
          </div>
        </div> */}

        {/* Developer Info */}
        <div className="card bg-gradient-to-br from-primary to-secondary text-white">
          <div className="flex items-center space-x-4 mb-4">
            <Code className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold">Developer Information</h2>
              <p className="text-white/80">Full-Stack AI Application</p>
            </div>
          </div>
          <p className="text-white/90 mb-4">
            This project demonstrates expertise in modern web development, AI/ML integration, and creating accessible solutions for real-world problems. Built with production-ready practices including modular architecture, error handling, and responsive design.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">React.js</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Node.js</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Python</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">MongoDB</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">AI/ML</span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">TailwindCSS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
