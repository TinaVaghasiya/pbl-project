import { useState } from 'react';

const SignCard = ({ letter, image, description, category }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="card group cursor-pointer">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-6xl font-bold group-hover:scale-110 transition-transform overflow-hidden">
          {image && !imageError ? (
            <img 
              src={image} 
              alt={letter} 
              className="w-full h-full object-cover" 
              onError={() => setImageError(true)}
            />
          ) : (
            <span>{letter}</span>
          )}
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">{letter}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
            {category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignCard;
