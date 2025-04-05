
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Film, Search, MenuIcon, X, LogOut } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

type HeaderAction = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

type HeaderProps = {
  onSearch?: (query: string) => void;
  actions?: HeaderAction[];
};

const Header = ({ onSearch, actions = [] }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  // Add logout action to the actions array if user is authenticated
  const allActions = useMemo(() => {
    if (isAuthenticated) {
      return [
        ...actions,
        {
          icon: <LogOut size={20} />,
          label: "Logout",
          onClick: () => {
            logout();
            navigate('/auth');
          }
        }
      ];
    }
    return actions;
  }, [actions, isAuthenticated, logout, navigate]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">MovieLens</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/movies" className="text-gray-300 hover:text-white transition-colors">Movies</Link>
            <Link to="/genres" className="text-gray-300 hover:text-white transition-colors">Genres</Link>
          </nav>

          {/* Search Bar */}
          {onSearch && (
            <div className="hidden md:flex relative w-1/3 max-w-xs">
              <Input
                type="text"
                placeholder="Search movies..."
                className="pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => handleSearch()}
              >
                <Search size={18} />
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {allActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                onClick={action.onClick}
                title={action.label}
              >
                {action.icon}
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-300 hover:text-white"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {onSearch && (
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search movies..."
                  className="pr-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <Search size={18} />
                </button>
              </form>
            )}
            
            <nav className="flex flex-col space-y-3">
              <a onClick={() => handleNavigation('/')} className="text-gray-300 hover:text-white transition-colors cursor-pointer">Home</a>
              <a onClick={() => handleNavigation('/movies')} className="text-gray-300 hover:text-white transition-colors cursor-pointer">Movies</a>
              <a onClick={() => handleNavigation('/genres')} className="text-gray-300 hover:text-white transition-colors cursor-pointer">Genres</a>
            </nav>
            
            <div className="flex flex-wrap gap-2">
              {allActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.onClick}
                  className="flex items-center space-x-2"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
