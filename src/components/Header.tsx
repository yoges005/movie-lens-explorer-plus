
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleSignIn = () => {
    toast({
      title: "Sign In Feature",
      description: "Sign In functionality will be available soon!",
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-movieLens-dark/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <h1 className="text-2xl font-bold text-white">
              <span className="text-movieLens-red">MOVIE</span>
              <span className="text-movieLens-blue">LENS</span>
            </h1>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-5 text-sm">
              <button 
                onClick={() => navigateTo("/")} 
                className="text-white hover:text-movieLens-red transition"
              >
                Home
              </button>
              <button 
                onClick={() => navigateTo("/movies")} 
                className="text-white hover:text-movieLens-red transition"
              >
                Movies
              </button>
              <button 
                onClick={() => navigateTo("/genres")} 
                className="text-white hover:text-movieLens-red transition"
              >
                Genres
              </button>
            </nav>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative w-64">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-1.5 px-4 pr-10 rounded-full bg-movieLens-gray/50 text-white border border-gray-700 focus:outline-none focus:border-movieLens-red text-sm"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search size={18} />
              </button>
            </form>

            <Button
              onClick={handleSignIn}
              className="bg-movieLens-red hover:bg-red-700 text-white py-1 px-4 rounded-full text-sm"
            >
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-1.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-800">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 pr-10 rounded-full bg-movieLens-gray/50 text-white border border-gray-700 focus:outline-none focus:border-movieLens-red"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search size={18} />
              </button>
            </form>

            <nav className="flex flex-col space-y-3">
              <button 
                onClick={() => navigateTo("/")} 
                className="text-white hover:text-movieLens-red py-2 transition"
              >
                Home
              </button>
              <button 
                onClick={() => navigateTo("/movies")} 
                className="text-white hover:text-movieLens-red py-2 transition"
              >
                Movies
              </button>
              <button 
                onClick={() => navigateTo("/genres")} 
                className="text-white hover:text-movieLens-red py-2 transition"
              >
                Genres
              </button>
              <Button
                onClick={handleSignIn}
                className="bg-movieLens-red hover:bg-red-700 text-white w-full py-2 mt-2 rounded-full"
              >
                Sign In
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
