
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MovieGrid from "@/components/MovieGrid";
import MovieDetails from "@/components/MovieDetails";
import MovieCard from "@/components/MovieCard";
import UserProfile from "@/components/UserProfile";
import ActorMovies from "@/components/ActorMovies";
import CompareMovies from "@/components/CompareMovies";
import { useUser } from "@/contexts/UserContext";
import { 
  Moon,
  Sun,
  User,
  Share2,
  Users,
  Film,
  GitCompare,
  Tags 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; 
import { 
  Movie, 
  fetchPopularMovies, 
  fetchTopRatedMovies, 
  fetchUpcomingMovies, 
  fetchNowPlayingMovies,
  fetchMoviesByLanguage,
  searchMovies
} from "@/services/api";

const Index = () => {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [tamilMovies, setTamilMovies] = useState<Movie[]>([]);
  const [koreanMovies, setKoreanMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isMovieDetailsOpen, setIsMovieDetailsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isActorMoviesOpen, setIsActorMoviesOpen] = useState(false);
  const [isCompareMoviesOpen, setIsCompareMoviesOpen] = useState(false);
  const [selectedMoviesForCompare, setSelectedMoviesForCompare] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const { theme, toggleTheme } = useUser();

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Load data in parallel
        const [popularData, topRatedData, upcomingData, nowPlayingData, tamilData, koreanData] = await Promise.all([
          fetchPopularMovies(),
          fetchTopRatedMovies(),
          fetchUpcomingMovies(),
          fetchNowPlayingMovies(),
          fetchMoviesByLanguage('ta'), // Tamil
          fetchMoviesByLanguage('ko')  // Korean
        ]);
        
        setPopularMovies(popularData);
        setTopRatedMovies(topRatedData);
        setUpcomingMovies(upcomingData);
        setTamilMovies(tamilData);
        setKoreanMovies(koreanData);
        
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
  
  const handleViewAllTamil = () => {
    navigate("/movies?language=tamil");
  };
  
  const handleViewAllKorean = () => {
    navigate("/movies?language=korean");
  };
  
  const handleShareMovie = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this movie on MovieLens!',
        url: window.location.href,
      }).catch(error => {
        console.error('Error sharing:', error);
      });
    } else {
      toast.success('Link copied to clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  };
  
  const handleAddToCompare = (movie: Movie) => {
    setSelectedMoviesForCompare([movie]);
    setIsCompareMoviesOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onSearch={handleSearch} 
        actions={[
          {
            icon: theme === "dark" ? <Sun size={20} /> : <Moon size={20} />,
            label: theme === "dark" ? "Light Mode" : "Dark Mode",
            onClick: toggleTheme
          },
          {
            icon: <User size={20} />,
            label: "Profile",
            onClick: () => setIsProfileOpen(true)
          },
          {
            icon: <Users size={20} />,
            label: "Actor Movies",
            onClick: () => setIsActorMoviesOpen(true)
          },
          {
            icon: <Compare size={20} />,
            label: "Compare Movies",
            onClick: () => setIsCompareMoviesOpen(true)
          },
          {
            icon: <Share2 size={20} />,
            label: "Share",
            onClick: handleShareMovie
          }
        ]}
      />
      
      <main className="flex-1 pt-16">
        {!isSearching ? (
          <>
            {/* Hero Section */}
            {featuredMovie && (
              <HeroSection 
                movie={featuredMovie} 
                onDetailsClick={handleMovieClick}
                onCompareClick={handleAddToCompare}
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
              
              {/* Tamil Movies */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">Tamil Movies</h2>
                  <button 
                    onClick={handleViewAllTamil}
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
                    : tamilMovies.slice(0, 8).map((movie) => (
                        <MovieCard 
                          key={movie.id} 
                          movie={movie} 
                          onClick={handleMovieClick} 
                        />
                      ))
                  }
                </div>
              </div>
              
              {/* Korean Movies */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">Korean Movies</h2>
                  <button 
                    onClick={handleViewAllKorean}
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
                    : koreanMovies.slice(0, 8).map((movie) => (
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
        onCompareClick={handleAddToCompare}
      />
      
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      
      <ActorMovies
        isOpen={isActorMoviesOpen}
        onClose={() => setIsActorMoviesOpen(false)}
        onMovieClick={handleMovieClick}
      />
      
      <CompareMovies
        isOpen={isCompareMoviesOpen}
        onClose={() => setIsCompareMoviesOpen(false)}
        initialMovies={selectedMoviesForCompare}
      />
    </div>
  );
};

export default Index;
