
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Search, Play, Star, Calendar, Clock, Film, ArrowLeft, ArrowRight } from "lucide-react";
import { Movie, MovieDetails, IMAGE_SIZES, fetchMovieDetails } from "@/services/api";
import { toast } from "sonner";

interface CompareMoviesProps {
  isOpen: boolean;
  onClose: () => void;
  initialMovies?: Movie[];
}

const CompareMovies = ({ isOpen, onClose, initialMovies = [] }: CompareMoviesProps) => {
  const [selectedMovies, setSelectedMovies] = useState<MovieDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const loadInitialMovies = async () => {
      if (initialMovies.length > 0) {
        setLoading(true);
        try {
          const detailsPromises = initialMovies.map(movie => 
            fetchMovieDetails(movie.id)
          );
          
          const loadedDetails = await Promise.all(detailsPromises);
          setSelectedMovies(loadedDetails.filter(Boolean) as MovieDetails[]);
        } catch (error) {
          console.error("Error loading initial movies for comparison:", error);
          toast.error("Failed to load movie details");
        } finally {
          setLoading(false);
        }
      }
    };
    
    if (isOpen) {
      loadInitialMovies();
    }
  }, [isOpen, initialMovies]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=2dca580c2a14b55200e784d157207b4d&query=${encodeURIComponent(
          searchQuery
        )}&language=en-US&page=1`
      );
      
      if (!response.ok) throw new Error("Search failed");
      
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  const addMovieToCompare = async (movie: Movie) => {
    if (selectedMovies.length >= 3) {
      toast.error("You can compare up to 3 movies at a time");
      return;
    }
    
    if (selectedMovies.some(m => m.id === movie.id)) {
      toast.error("This movie is already selected for comparison");
      return;
    }
    
    setLoading(true);
    try {
      const details = await fetchMovieDetails(movie.id);
      if (details) {
        setSelectedMovies([...selectedMovies, details]);
        setSearchResults([]);
        setSearchQuery("");
      }
    } catch (error) {
      console.error("Error adding movie to compare:", error);
      toast.error("Failed to load movie details");
    } finally {
      setLoading(false);
    }
  };

  const removeMovie = (movieId: number) => {
    setSelectedMovies(selectedMovies.filter(movie => movie.id !== movieId));
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-movieLens-gray text-white border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Compare Movies</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search and add movie */}
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for a movie to compare..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="bg-movieLens-dark border-gray-700 pr-10"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSearch}
                className="absolute right-0 top-0 h-full text-gray-400 hover:text-white"
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <Search size={16} />
                )}
              </Button>
            </div>
          </div>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div className="bg-movieLens-dark rounded-lg p-3">
              <h3 className="text-sm font-medium mb-2">Search Results</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                {searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-black/20 cursor-pointer transition"
                    onClick={() => addMovieToCompare(movie)}
                  >
                    <div className="w-full aspect-[2/3] mb-2 rounded overflow-hidden">
                      {movie.poster_path ? (
                        <img
                          src={`${IMAGE_SIZES.poster.small}${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-movieLens-dark flex items-center justify-center">
                          <Film size={24} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-center line-clamp-1">{movie.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected movies for comparison */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-movieLens-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : selectedMovies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedMovies.map((movie) => (
                <div key={movie.id} className="relative bg-movieLens-dark rounded-lg overflow-hidden">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeMovie(movie.id)}
                    className="absolute top-2 right-2 h-8 w-8 bg-black/50 hover:bg-red-600 z-10 rounded-full"
                  >
                    <X size={16} />
                  </Button>
                  
                  {/* Movie poster */}
                  <div className="relative aspect-[2/3]">
                    {movie.backdrop_path ? (
                      <img
                        src={`${IMAGE_SIZES.backdrop.medium}${movie.backdrop_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-movieLens-dark flex items-center justify-center">
                        <Film size={36} className="text-gray-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  </div>
                  
                  {/* Movie details */}
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2">{movie.title}</h2>
                    
                    <div className="space-y-4">
                      {/* Genres */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Genres</h3>
                        <div className="flex flex-wrap gap-1">
                          {movie.genres.map((genre) => (
                            <span
                              key={genre.id}
                              className="text-xs bg-movieLens-blue/20 px-2 py-0.5 rounded-full"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Basic info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Rating</h3>
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-400 mr-1" />
                            <span>{movie.vote_average.toFixed(1)}/10</span>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Release</h3>
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-1" />
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Runtime</h3>
                          <div className="flex items-center">
                            <Clock size={16} className="mr-1" />
                            <span>{formatRuntime(movie.runtime)}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Language</h3>
                          <span className="capitalize">{movie.original_language}</span>
                        </div>
                      </div>
                      
                      {/* Cast */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Cast</h3>
                        <div className="flex -space-x-2 overflow-hidden">
                          {movie.credits.cast.slice(0, 5).map((actor) => (
                            <Avatar key={actor.id} className="border-2 border-gray-800 w-8 h-8">
                              {actor.profile_path ? (
                                <AvatarImage
                                  src={`${IMAGE_SIZES.profile.small}${actor.profile_path}`}
                                  alt={actor.name}
                                />
                              ) : (
                                <AvatarFallback className="text-xs bg-movieLens-blue">
                                  {actor.name.charAt(0)}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          ))}
                          {movie.credits.cast.length > 5 && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-movieLens-blue text-xs">
                              +{movie.credits.cast.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {selectedMovies.length < 3 && (
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg min-h-[300px] cursor-pointer hover:border-movieLens-blue transition-colors"
                  onClick={() => document.querySelector('input')?.focus()}
                >
                  <Search size={36} className="mb-2 text-gray-500" />
                  <p className="text-gray-500">Add another movie (up to 3)</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Film size={48} className="mb-4" />
              <h3 className="text-xl font-medium mb-2">No movies selected for comparison</h3>
              <p className="mb-4">Search for movies to add them to comparison</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompareMovies;
