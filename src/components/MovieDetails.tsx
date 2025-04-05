import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MovieDetails as MovieDetailsType, fetchMovieDetails, IMAGE_SIZES } from "@/services/api";
import { Clock, Calendar, Star, DollarSign, Award, X, Share2, GitCompare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MovieReview, { ReviewsList } from "./MovieReview";
import { toast } from "sonner";

interface MovieDetailsProps {
  movieId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onCompareClick?: (movie: MovieDetailsType) => void;
}

const MovieDetails = ({ movieId, isOpen, onClose, onCompareClick }: MovieDetailsProps) => {
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewMode, setReviewMode] = useState<"view" | "add">("view");
  const { toast: uiToast } = useToast();

  useEffect(() => {
    const loadMovieDetails = async () => {
      if (!movieId) return;
      
      setLoading(true);
      try {
        const details = await fetchMovieDetails(movieId);
        setMovie(details);
      } catch (error) {
        console.error("Error loading movie details:", error);
        uiToast({
          title: "Error",
          description: "Failed to load movie details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && movieId) {
      loadMovieDetails();
    }
  }, [movieId, isOpen, uiToast]);

  const formatCurrency = (amount: number) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handlePlayTrailer = () => {
    uiToast({
      title: "Coming Soon",
      description: "Trailer playback will be available in a future update!",
    });
  };
  
  const handleShare = () => {
    if (navigator.share && movie) {
      navigator.share({
        title: movie.title,
        text: `Check out ${movie.title} on MovieLens!`,
        url: window.location.href,
      }).catch(error => {
        console.error('Error sharing:', error);
      });
    } else {
      toast.success('Link copied to clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  };
  
  const handleReviewAdded = () => {
    setReviewMode("view");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-movieLens-gray text-white border-none">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl">{loading ? "Loading..." : movie?.title}</DialogTitle>
          <div className="flex items-center gap-2">
            {movie && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                  onClick={handleShare}
                >
                  <Share2 size={18} />
                </Button>
                
                {onCompareClick && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                    onClick={() => onCompareClick(movie)}
                  >
                    <GitCompare size={18} />
                  </Button>
                )}
              </>
            )}
            
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-movieLens-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : movie ? (
          <div className="space-y-6">
            {/* Backdrop Image */}
            {movie.backdrop_path && (
              <div className="relative w-full h-[300px] overflow-hidden rounded-lg">
                <img
                  src={`${IMAGE_SIZES.backdrop.large}${movie.backdrop_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center">
                  <Button 
                    onClick={handlePlayTrailer}
                    className="bg-movieLens-red hover:bg-red-700 text-white rounded-full h-16 w-16 flex items-center justify-center"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </Button>
                </div>
              </div>
            )}

            {/* Movie Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Poster */}
              <div className="md:col-span-1">
                {movie.poster_path ? (
                  <img
                    src={`${IMAGE_SIZES.poster.medium}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full rounded-lg"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-movieLens-dark rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No poster available</span>
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="md:col-span-2 space-y-4">
                {movie.tagline && (
                  <p className="text-gray-400 italic text-lg">{movie.tagline}</p>
                )}

                <div className="flex flex-wrap gap-3 text-sm">
                  {movie.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-movieLens-dark px-3 py-1 rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-400" />
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} />
                    <span>Budget: {formatCurrency(movie.budget)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Overview</h3>
                  <p className="text-gray-300">{movie.overview}</p>
                </div>

                {/* Cast */}
                {movie.credits?.cast && movie.credits.cast.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Cast</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {movie.credits.cast.slice(0, 6).map((person) => (
                        <div key={person.id} className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-movieLens-dark flex-shrink-0">
                            {person.profile_path ? (
                              <img
                                src={`${IMAGE_SIZES.profile.small}${person.profile_path}`}
                                alt={person.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs">
                                {person.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{person.name}</p>
                            <p className="text-xs text-gray-400 truncate">{person.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Director */}
                {movie.credits?.crew && (
                  <div>
                    {movie.credits.crew.filter(person => person.job === "Director").length > 0 && (
                      <div className="flex items-start gap-2">
                        <Award size={18} />
                        <div>
                          <span className="text-gray-400">Director: </span>
                          {movie.credits.crew
                            .filter(person => person.job === "Director")
                            .map(director => director.name)
                            .join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-6 border-t border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Reviews</h3>
                <div className="flex gap-2">
                  <Button 
                    variant={reviewMode === "view" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReviewMode("view")}
                    className={reviewMode === "view" ? "bg-movieLens-blue" : "border-gray-600"}
                  >
                    View Reviews
                  </Button>
                  <Button 
                    variant={reviewMode === "add" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setReviewMode("add")}
                    className={reviewMode === "add" ? "bg-movieLens-blue" : "border-gray-600"}
                  >
                    Write Review
                  </Button>
                </div>
              </div>
              
              {reviewMode === "add" ? (
                <MovieReview movie={movie} onReviewAdded={handleReviewAdded} />
              ) : (
                <ReviewsList movieId={movie.id} />
              )}
            </div>

            {/* Similar Movies */}
            {movie.similar?.results && movie.similar.results.length > 0 && (
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Similar Movies</h3>
                <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
                  {movie.similar.results.slice(0, 10).map((similar) => (
                    <div key={similar.id} className="flex-shrink-0 w-32">
                      <div className="rounded-lg overflow-hidden">
                        {similar.poster_path ? (
                          <img
                            src={`${IMAGE_SIZES.poster.small}${similar.poster_path}`}
                            alt={similar.title}
                            className="w-full aspect-[2/3] object-cover"
                          />
                        ) : (
                          <div className="w-full aspect-[2/3] bg-movieLens-dark flex items-center justify-center p-2 text-center">
                            <span className="text-xs">{similar.title}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs mt-1 truncate">{similar.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-400">
            Failed to load movie details
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetails;
