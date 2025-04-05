
import { Movie } from "@/services/api";
import MovieCard from "./MovieCard";
import { Button } from "@/components/ui/button";

interface MovieGridProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const MovieGrid = ({
  title,
  movies,
  onMovieClick,
  isLoading = false,
  onLoadMore,
  hasMore = false,
}: MovieGridProps) => {
  return (
    <div className="mb-12">
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-white">{title}</h2>
      
      {isLoading && movies.length === 0 ? (
        <div className="grid movie-grid">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-movieLens-gray rounded-lg overflow-hidden">
              <div className="aspect-[2/3] animate-pulse bg-gray-700"></div>
              <div className="p-2">
                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid movie-grid">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={onMovieClick}
              />
            ))}
          </div>
          
          {onLoadMore && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={onLoadMore}
                disabled={isLoading || !hasMore}
                className="bg-movieLens-gray hover:bg-gray-700 text-white px-6"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Loading</span>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center h-48 text-gray-400">
          No movies found
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
