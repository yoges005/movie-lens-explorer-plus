
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MovieGrid from "@/components/MovieGrid";
import MovieDetails from "@/components/MovieDetails";
import { 
  Movie, 
  fetchPopularMovies, 
  fetchTopRatedMovies, 
  fetchUpcomingMovies, 
  fetchNowPlayingMovies,
  searchMovies
} from "@/services/api";

const Index = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isMovieDetailsOpen, setIsMovieDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Load data in parallel
        const [popularData, topRatedData, upcomingData, nowPlayingData] = await Promise.all([
          fetchPopularMovies(),
          fetchTopRatedMovies(),
          fetchUpcomingMovies(),
          fetchNowPlayingMovies()
        ]);
        
        setPopularMovies(popularData);
        setTopRatedMovies(topRatedData);
        setUpcomingMovies(upcomingData);
        
        // Set a featured movie from now playing
        if (nowPlayingData.length > 0) {
          // Get a random movie for the hero section
          const randomIndex = Math.floor(Math.random() * Math.min(5, nowPlayingData.length));
          setFeaturedMovie(nowPlayingData[randomIndex]);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setSearchQuery(query);
    setIsSearching(true);
    
    try {
      const results = await searchMovies(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovieId(movie.id);
    setIsMovieDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setIsMovieDetailsOpen(false);
    setSelectedMovieId(null);
  };

  const handleViewAllPopular = () => {
    navigate("/movies?category=popular");
  };

  const handleViewAllTopRated = () => {
    navigate("/movies?category=top-rated");
  };

  const handleViewAllUpcoming = () => {
    navigate("/movies?category=upcoming");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearch={handleSearch} />
      
      <main className="flex-1 pt-16">
        {!isSearching ? (
          <>
            {/* Hero Section */}
            {featuredMovie && (
              <HeroSection 
                movie={featuredMovie} 
                onDetailsClick={handleMovieClick} 
              />
            )}
            
            <div className="container mx-auto px-4 py-8">
              {/* Popular Movies */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">Popular Movies</h2>
                  <button 
                    onClick={handleViewAllPopular}
                    className="text-movieLens-blue hover:text-blue-400 text-sm"
                  >
                    View All
                  </button>
                </div>
                <div className="grid movie-grid">
                  {isLoading
                    ? Array(8).fill(0).map((_, index) => (
                        <div key={index} className="rounded-lg overflow-hidden">
                          <div className="aspect-[2/3] animate-pulse bg-movieLens-gray"></div>
                          <div className="p-2">
                            <div className="h-4 bg-movieLens-gray animate-pulse rounded"></div>
                          </div>
                        </div>
                      ))
                    : popularMovies.slice(0, 8).map((movie) => (
                        <MovieCard 
                          key={movie.id} 
                          movie={movie} 
                          onClick={handleMovieClick} 
                        />
                      ))
                  }
                </div>
              </div>
              
              {/* Top Rated Movies */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">Top Rated</h2>
                  <button 
                    onClick={handleViewAllTopRated}
                    className="text-movieLens-blue hover:text-blue-400 text-sm"
                  >
                    View All
                  </button>
                </div>
                <div className="grid movie-grid">
                  {isLoading
                    ? Array(8).fill(0).map((_, index) => (
                        <div key={index} className="rounded-lg overflow-hidden">
                          <div className="aspect-[2/3] animate-pulse bg-movieLens-gray"></div>
                          <div className="p-2">
                            <div className="h-4 bg-movieLens-gray animate-pulse rounded"></div>
                          </div>
                        </div>
                      ))
                    : topRatedMovies.slice(0, 8).map((movie) => (
                        <MovieCard 
                          key={movie.id} 
                          movie={movie} 
                          onClick={handleMovieClick} 
                        />
                      ))
                  }
                </div>
              </div>
              
              {/* Upcoming Movies */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">Coming Soon</h2>
                  <button 
                    onClick={handleViewAllUpcoming}
                    className="text-movieLens-blue hover:text-blue-400 text-sm"
                  >
                    View All
                  </button>
                </div>
                <div className="grid movie-grid">
                  {isLoading
                    ? Array(8).fill(0).map((_, index) => (
                        <div key={index} className="rounded-lg overflow-hidden">
                          <div className="aspect-[2/3] animate-pulse bg-movieLens-gray"></div>
                          <div className="p-2">
                            <div className="h-4 bg-movieLens-gray animate-pulse rounded"></div>
                          </div>
                        </div>
                      ))
                    : upcomingMovies.slice(0, 8).map((movie) => (
                        <MovieCard 
                          key={movie.id} 
                          movie={movie} 
                          onClick={handleMovieClick} 
                        />
                      ))
                  }
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4 py-8 mt-10">
            <MovieGrid
              title={`Search Results for "${searchQuery}"`}
              movies={searchResults}
              onMovieClick={handleMovieClick}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>
      
      <Footer />
      
      <MovieDetails
        movieId={selectedMovieId}
        isOpen={isMovieDetailsOpen}
        onClose={handleDetailsClose}
      />
    </div>
  );
};

export default Index;
