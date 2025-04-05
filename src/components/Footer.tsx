
import { Github, Heart, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-movieLens-dark border-t border-gray-800 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              <span className="text-movieLens-red">MOVIE</span>
              <span className="text-movieLens-blue">LENS</span>
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Your ultimate destination for exploring and discovering movies from across the globe. With over 1000+ titles, we've got something for everyone.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition">Home</a>
              </li>
              <li>
                <a href="/movies" className="text-gray-400 hover:text-white transition">Movies</a>
              </li>
              <li>
                <a href="/genres" className="text-gray-400 hover:text-white transition">Genres</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Top Rated</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">New Releases</a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">FAQ</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} MovieLens. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-4 md:mt-0">
            Made with <Heart size={14} className="mx-1 text-movieLens-red" /> using React, Tailwind and TMDb API
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
