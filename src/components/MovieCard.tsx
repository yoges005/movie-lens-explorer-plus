
import { useState } from "react";
import { Movie, IMAGE_SIZES } from "@/services/api";
import { Calendar, Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const posterUrl = movie.poster_path
    ? `${IMAGE_SIZES.poster.medium}${movie.poster_path}`
    : "/placeholder.svg";

  return (
    <div 
      className="movie-card rounded-lg overflow-hidden cursor-pointer"
      onClick={() => onClick(movie)}
    >
      <div className="relative aspect-[2/3] bg-movieLens-gray">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-movieLens-gray">
            <div className="w-8 h-8 border-4 border-movieLens-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-movieLens-gray text-white text-sm p-2 text-center">
            {movie.title}
          </div>
        ) : (
          <img
            src={posterUrl}
            alt={movie.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-6 pb-2 px-3">
          <div className="flex items-center justify-between text-xs text-gray-300">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{formatDate(movie.release_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-2">
        <h3 className="text-sm font-medium line-clamp-1 text-white">{movie.title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;
