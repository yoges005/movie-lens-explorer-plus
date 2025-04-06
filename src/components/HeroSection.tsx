
import { useState, useEffect } from "react";
import { Movie, IMAGE_SIZES, fetchMovieTrailers } from "@/services/api";
import { Play, Info, Calendar, Star, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface HeroSectionProps {
  movie: Movie;
  onDetailsClick: (movie: Movie) => void;
  onCompareClick?: (movie: Movie) => void;
}

const HeroSection = ({ movie, onDetailsClick, onCompareClick }: HeroSectionProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTrailerLoading, setIsTrailerLoading] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [movie]);

  if (!movie) return null;

  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_SIZES.backdrop.original}${movie.backdrop_path}`
    : "/placeholder.svg";

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleTrailerClick = async () => {
    try {
      setIsTrailerLoading(true);
      const trailerKey = await fetchMovieTrailers(movie.id);
      
      if (trailerKey) {
        // Open the movie details with trailer ready to play
        onDetailsClick(movie);
      } else {
        toast.error("No trailer available for this movie");
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      toast.error("Failed to load movie trailer");
    } finally {
      setIsTrailerLoading(false);
    }
  };

  return (
    <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
      {/* Loading Indicator */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-movieLens-dark flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-movieLens-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Background Image */}
      <img
        src={backdropUrl}
        alt={movie.title}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImageLoaded(true)}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-movieLens-dark via-movieLens-dark/80 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-0 flex items-end md:items-center p-6 md:p-16">
        <div className="container mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 movie-title">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{formatDate(movie.release_date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-yellow-400" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 line-clamp-3 md:line-clamp-4">{movie.overview}</p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleTrailerClick}
                className="bg-movieLens-red hover:bg-red-700 text-white flex items-center gap-2"
                disabled={isTrailerLoading}
              >
                {isTrailerLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    <span>Watch Trailer</span>
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => onDetailsClick(movie)}
                className="border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center gap-2"
              >
                <Info size={16} />
                <span>More Info</span>
              </Button>
              
              {onCompareClick && (
                <Button 
                  variant="outline" 
                  onClick={() => onCompareClick(movie)}
                  className="border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center gap-2"
                >
                  <GitCompare size={16} />
                  <span>Compare</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
