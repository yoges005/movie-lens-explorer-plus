
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, X, User } from "lucide-react";
import { Actor, Movie, searchActors, fetchMoviesByActor, IMAGE_SIZES } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import { toast } from "sonner";

interface ActorMoviesProps {
  isOpen: boolean;
  onClose: () => void;
  onMovieClick: (movie: Movie) => void;
}

const ActorMovies = ({ isOpen, onClose, onMovieClick }: ActorMoviesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actors, setActors] = useState<Actor[]>([]);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchActors(searchQuery);
      setActors(results.filter(actor => actor.known_for_department === "Acting"));
      setSelectedActor(null);
      setMovies([]);
    } catch (error) {
      console.error("Error searching actors:", error);
      toast.error("Failed to search actors");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectActor = async (actor: Actor) => {
    setSelectedActor(actor);
    setIsLoading(true);
    
    try {
      const actorMovies = await fetchMoviesByActor(actor.id);
      setMovies(actorMovies);
    } catch (error) {
      console.error("Error fetching actor movies:", error);
      toast.error("Failed to load movies for this actor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    onMovieClick(movie);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[900px] max-h-[90vh] overflow-y-auto bg-movieLens-gray text-white border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Actor Filmography</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search for an actor..."
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
                disabled={isLoading}
              >
                {isLoading && !selectedActor ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <Search size={16} />
                )}
              </Button>
            </div>
          </div>

          {selectedActor ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedActor(null)}
                  className="h-8 w-8 rounded-full"
                >
                  <X size={16} />
                </Button>
                
                <div className="flex items-center space-x-3">
                  <Avatar className="h-16 w-16 border-2 border-movieLens-blue">
                    {selectedActor.profile_path ? (
                      <AvatarImage
                        src={`${IMAGE_SIZES.profile.medium}${selectedActor.profile_path}`}
                        alt={selectedActor.name}
                      />
                    ) : (
                      <AvatarFallback className="bg-movieLens-blue">
                        {selectedActor.name.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div>
                    <h2 className="text-xl font-semibold">{selectedActor.name}</h2>
                    <p className="text-sm text-gray-400">Showing all {movies.length} movies</p>
                  </div>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="w-10 h-10 border-4 border-movieLens-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : movies.length > 0 ? (
                <div className="grid movie-grid">
                  {movies.map((movie) => (
                    <MovieCard 
                      key={movie.id} 
                      movie={movie} 
                      onClick={handleMovieSelect} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No movies found for this actor
                </div>
              )}
            </div>
          ) : (
            <>
              {actors.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {actors.map((actor) => (
                    <div
                      key={actor.id}
                      className="flex flex-col items-center p-3 bg-movieLens-dark rounded-lg cursor-pointer hover:bg-movieLens-blue/20 transition"
                      onClick={() => handleSelectActor(actor)}
                    >
                      <Avatar className="h-20 w-20 mb-2">
                        {actor.profile_path ? (
                          <AvatarImage
                            src={`${IMAGE_SIZES.profile.medium}${actor.profile_path}`}
                            alt={actor.name}
                          />
                        ) : (
                          <AvatarFallback className="bg-movieLens-blue">
                            {actor.name.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <h3 className="text-center font-medium">{actor.name}</h3>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <User size={48} className="mb-4" />
                  <h3 className="text-xl font-medium mb-2">Search for an actor</h3>
                  <p>Find all movies starring your favorite actors</p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActorMovies;
