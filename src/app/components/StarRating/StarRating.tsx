import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;           
  maxStars?: number;
  size?: number;
  interactive?: boolean;    
  onRate?: (rate: number) => void; 
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxStars = 5, 
  size = 20, 
  interactive = false,
  onRate 
}) => {
  return (
    <div className="flex gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <Star
            key={index}
            size={size}
            className={`
              ${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}
              ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            `}
            onClick={() => interactive && onRate && onRate(starValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;