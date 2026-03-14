import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import SignCard from '../components/SignCard';
import Loading from '../components/common/Loading';
import { getAllSigns } from '../utils/api';

const Learning = () => {
  const [signs, setSigns] = useState([]);
  const [filteredSigns, setFilteredSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'alphabet', label: 'Alphabets (A-Z)' },
    { value: 'number', label: 'Numbers (0-9)' },
    { value: 'word', label: 'Common Words' },
    { value: 'sentence', label: 'Sentences' }
  ];

  useEffect(() => {
    fetchSigns();
  }, []);

  useEffect(() => {
    filterSigns();
  }, [signs, searchTerm, selectedCategory]);

  const fetchSigns = async () => {
    try {
      setLoading(true);
      const response = await getAllSigns();
      setSigns(response.data.data);
    } catch (error) {
      console.error('Error fetching signs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSigns = () => {
    let filtered = signs;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(sign => sign.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(sign =>
        sign.letter.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSigns(filtered);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Learn Sign Language</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Master sign language alphabets, numbers, and common words
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search signs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field pl-10 pr-8 appearance-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Signs Grid */}
        {loading ? (
          <Loading message="Loading signs..." />
        ) : filteredSigns.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSigns.map((sign) => (
              <SignCard
                key={sign._id}
                letter={sign.letter}
                image={sign.image}
                description={sign.description}
                category={sign.category}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No signs found. Try adjusting your search or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learning;
