
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MovieGrid from "@/components/MovieGrid";
import MovieDetails from "@/components/MovieDetails";
import { Movie, fetchPopularMovies, fetchTopRatedMovies, fetchUpcomingMovies, fetchNowPlayingMovies, searchMovies } from "@/services/api";

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "popular";
  const query = searchParams.get("query") || "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isMovieDetailsOpen, setIsMovieDetailsOpen] = useState(false);

  const categoryTitles: Record<string, string> = {
    "popular": "Popular Movies",
    "top-rated": "Top Rated Movies",
    "upcoming": "Upcoming Movies",
    "now-playing": "Now Playing Movies",
    "search": `Search Results for "${query}"`
  };

  const loadMovies = useCallback(async (page = 1, resetMovies = true) => {
    setIsLoading(true);
    
    try {
      let newMovies: Movie[] = [];
      
      if (query) {
        newMovies = await searchMovies(query, page);
        setSearchParams({ category: "search", query });
      } else {
        switch (category) {
          case "popular":
            newMovies = await fetchPopularMovies(page);
            break;
          case "top-rated":
            newMovies = await fetchTopRatedMovies(page);
            break;
          case "upcoming":
            newMovies = await fetchUpcomingMovies(page);
            break;
          case "now-playing":
            newMovies = await fetchNowPlayingMovies(page);
            break;
          default:
            newMovies = await fetchPopularMovies(page);
        }
      }

      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      
      if (resetMovies) {
        setMovies(newMovies);
        window.scrollTo(0, 0);
      } else {
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      }
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [category, query, setSearchParams]);

  useEffect(() => {
    setCurrentPage(1);
    loadMovies(1, true);
  }, [category, query, loadMovies]);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim()) {
      setSearchParams({ category: "search", query: searchQuery });
    } else {
      setSearchParams({ category: "popular" });
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadMovies(nextPage, false);
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovieId(movie.id);
    setIsMovieDetailsOpen(true);
  };

  const handleCategoryChange = (newCategory: string) => {
    setSearchParams({ category: newCategory });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      
      <main className="flex-1 pt-24 pb-10">
        <div className="container mx-auto px-4">
          {/* Category Tabs */}
          <div className="mb-8 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 min-w-max pb-2">
              <button
                onClick={() => handleCategoryChange("popular")}
                className={`px-4 py-2 rounded-full transition ${
                  category === "popular"
                    ? "bg-movieLens-red text-white"
                    : "bg-movieLens-gray/50 text-gray-300 hover:bg-movieLens-gray"
                }`}
              >
                Popular
              </button>
              <button
                onClick={() => handleCategoryChange("top-rated")}
                className={`px-4 py-2 rounded-full transition ${
                  category === "top-rated"
                    ? "bg-movieLens-red text-white"
                    : "bg-movieLens-gray/50 text-gray-300 hover:bg-movieLens-gray"
                }`}
              >
                Top Rated
              </button>
              <button
                onClick={() => handleCategoryChange("upcoming")}
                className={`px-4 py-2 rounded-full transition ${
                  category === "upcoming"
                    ? "bg-movieLens-red text-white"
                    : "bg-movieLens-gray/50 text-gray-300 hover:bg-movieLens-gray"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => handleCategoryChange("now-playing")}
                className={`px-4 py-2 rounded-full transition ${
                  category === "now-playing"
                    ? "bg-movieLens-red text-white"
                    : "bg-movieLens-gray/50 text-gray-300 hover:bg-movieLens-gray"
                }`}
              >
                Now Playing
              </button>
            </div>
          </div>

          <MovieGrid
            title={categoryTitles[category] || "Movies"}
            movies={movies}
            onMovieClick={handleMovieClick}
            isLoading={isLoading && movies.length === 0}
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

export default MoviesPage;
