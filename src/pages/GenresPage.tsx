
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MovieGrid from "@/components/MovieGrid";
import MovieDetails from "@/components/MovieDetails";
import { Movie, Genre, fetchGenres, fetchMoviesByGenre, searchMovies } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

const GenresPage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenresLoading, setIsGenresLoading] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isMovieDetailsOpen, setIsMovieDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      setIsGenresLoading(true);
      try {
        const genresList = await fetchGenres();
        setGenres(genresList);
        
        // Select the first genre by default if there are genres
        if (genresList.length > 0) {
          setSelectedGenre(genresList[0]);
        }
      } catch (error) {
        console.error("Error loading genres:", error);
      } finally {
        setIsGenresLoading(false);
      }
    };

    loadGenres();
  }, []);

  useEffect(() => {
    const loadMoviesByGenre = async () => {
      if (!selectedGenre) return;
      
      setIsLoading(true);
      setCurrentPage(1);
      setMovies([]);
      
      try {
        const genreMovies = await fetchMoviesByGenre(selectedGenre.id, 1);
        setMovies(genreMovies);
        setHasMore(genreMovies.length === 20); // Most APIs return 20 items per page
      } catch (error) {
        console.error("Error loading movies by genre:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMoviesByGenre();
  }, [selectedGenre]);

  const handleGenreSelect = (genre: Genre) => {
    setSelectedGenre(genre);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovieId(movie.id);
    setIsMovieDetailsOpen(true);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      // If search is cleared and we have a selected genre, reload the genre's movies
      if (selectedGenre) {
        const genreMovies = await fetchMoviesByGenre(selectedGenre.id, 1);
        setMovies(genreMovies);
      }
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchMovies(query);
      setMovies(results);
      setSelectedGenre(null);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!selectedGenre) return;
    
    const nextPage = currentPage + 1;
    setIsLoading(true);
    
    try {
      const moreMovies = await fetchMoviesByGenre(selectedGenre.id, nextPage);
      setMovies(prev => [...prev, ...moreMovies]);
      setCurrentPage(nextPage);
      setHasMore(moreMovies.length === 20);
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      
      <main className="flex-1 pt-24 pb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">Movie Genres</h1>
          
          {/* Genres Grid */}
          <div className="mb-10">
            {isGenresLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {Array(12).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-12 bg-movieLens-gray" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {genres.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreSelect(genre)}
                    className={`py-3 px-4 rounded-lg text-center transition ${
                      selectedGenre?.id === genre.id
                        ? "bg-movieLens-red text-white"
                        : "bg-movieLens-gray/50 text-gray-300 hover:bg-movieLens-gray hover:text-white"
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Movies Grid for Selected Genre */}
          <MovieGrid
            title={selectedGenre ? `${selectedGenre.name} Movies` : "Movies"}
            movies={movies}
            onMovieClick={handleMovieClick}
            isLoading={isLoading}
            onLoadMore={handleLoadMore}
            hasMore={hasMore && !isLoading}
          />
        </div>
      </main>
      
      <Footer />
      
      <MovieDetails
        movieId={selectedMovieId}
        isOpen={isMovieDetailsOpen}
        onClose={() => setIsMovieDetailsOpen(false)}
      />
    </div>
  );
};

export default GenresPage;
