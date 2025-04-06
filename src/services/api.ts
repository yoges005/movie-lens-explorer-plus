
import { toast } from "sonner";

// Movie API base URL
const API_KEY = "2dca580c2a14b55200e784d157207b4d";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Image sizes for different components
export const IMAGE_SIZES = {
  poster: {
    small: `${IMAGE_BASE_URL}/w342`,
    medium: `${IMAGE_BASE_URL}/w500`,
    large: `${IMAGE_BASE_URL}/w780`,
    original: `${IMAGE_BASE_URL}/original`,
  },
  backdrop: {
    small: `${IMAGE_BASE_URL}/w300`,
    medium: `${IMAGE_BASE_URL}/w780`,
    large: `${IMAGE_BASE_URL}/w1280`,
    original: `${IMAGE_BASE_URL}/original`,
  },
  profile: {
    small: `${IMAGE_BASE_URL}/w45`,
    medium: `${IMAGE_BASE_URL}/w185`,
    large: `${IMAGE_BASE_URL}/h632`,
    original: `${IMAGE_BASE_URL}/original`,
  },
};

// Types
export type Language = "English" | "Tamil" | "Korean" | "Spanish" | "French" | "Japanese" | "Other";
export type Mood = "Funny" | "Heart-breaking" | "Thrilling" | "Romantic" | "Action-packed" | "Suspenseful" | "Inspirational";

export interface UserReview {
  id: string;
  userId: string;
  userName: string;
  userPhotoUrl?: string;
  rating: number;
  review: string;
  photoUrl?: string;
  createdAt: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  overview: string;
  vote_average: number;
  genre_ids: number[];
  original_language: string;
  language?: Language;
  userReviews?: UserReview[];
  mood?: Mood[];
  category?: string[];
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string; origin_country: string }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      profile_path: string;
    }[];
  };
  similar: {
    results: Movie[];
  };
}

export interface Genre {
  id: number;
  name: string;
}

export interface Actor {
  id: number;
  name: string;
  profile_path: string;
  known_for_department: string;
  popularity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

// Fetch functions
export const fetchPopularMovies = async (page = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}&language=en-US`);
    if (!response.ok) throw new Error("Failed to fetch popular movies");
    const data = await response.json();
    return data.results as Movie[];
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    toast.error("Failed to load popular movies");
    return [];
  }
};

export const fetchTopRatedMovies = async (page = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}&language=en-US`);
    if (!response.ok) throw new Error("Failed to fetch top rated movies");
    const data = await response.json();
    return data.results as Movie[];
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    toast.error("Failed to load top rated movies");
    return [];
  }
};

export const fetchUpcomingMovies = async (page = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}&language=en-US`);
    if (!response.ok) throw new Error("Failed to fetch upcoming movies");
    const data = await response.json();
    return data.results as Movie[];
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    toast.error("Failed to load upcoming movies");
    return [];
  }
};

export const fetchNowPlayingMovies = async (page = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}&language=en-US`);
    if (!response.ok) throw new Error("Failed to fetch now playing movies");
    const data = await response.json();
    return data.results as Movie[];
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    toast.error("Failed to load now playing movies");
    return [];
  }
};

export const fetchMovieDetails = async (id: number): Promise<MovieDetails | null> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,similar&language=en-US`);
    if (!response.ok) throw new Error("Failed to fetch movie details");
    const data = await response.json();
    return data as MovieDetails;
  } catch (error) {
    console.error(`Error fetching movie details for id ${id}:`, error);
    toast.error("Failed to load movie details");
    return null;
  }
};

export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) throw new Error("Failed to fetch genres");
    const data = await response.json();
    return data.genres as Genre[];
  } catch (error) {
    console.error("Error fetching genres:", error);
    toast.error("Failed to load genres");
    return [];
  }
};

export const fetchMoviesByGenre = async (genreId: number, page = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&language=en-US`);
    if (!response.ok) throw new Error(`Failed to fetch movies for genre ${genreId}`);
    const data = await response.json();
    return data.results as Movie[];
  } catch (error) {
    console.error(`Error fetching movies for genre ${genreId}:`, error);
    toast.error("Failed to load movies for this genre");
    return [];
  }
};

export const fetchMoviesByLanguage = async (language: string, page = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_original_language=${language}&page=${page}&language=en-US`);
    if (!response.ok) throw new Error(`Failed to fetch ${language} movies`);
    const data = await response.json();
    return data.results as Movie[];
  } catch (error) {
    console.error(`Error fetching ${language} movies:`, error);
    toast.error(`Failed to load ${language} movies`);
    return [];
  }
};

export const fetchMoviesByActor = async (actorId: number, page = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_cast=${actorId}&page=${page}&language=en-US`);
    if (!response.ok) throw new Error(`Failed to fetch movies by actor`);
    const data = await response.json();
    return data.results as Movie[];
  } catch (error) {
    console.error(`Error fetching movies by actor:`, error);
    toast.error(`Failed to load movies for this actor`);
    return [];
  }
};

export const searchMovies = async (query: string, page = 1): Promise<Movie[]> => {
  try {
    if (!query.trim()) return [];
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`);
    if (!response.ok) throw new Error("Failed to search movies");
    const data = await response.json();
    return data.results as Movie[];
  } catch (error) {
    console.error("Error searching movies:", error);
    toast.error("Failed to search movies");
    return [];
  }
};

export const searchActors = async (query: string, page = 1): Promise<Actor[]> => {
  try {
    if (!query.trim()) return [];
    const response = await fetch(`${BASE_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`);
    if (!response.ok) throw new Error("Failed to search actors");
    const data = await response.json();
    return data.results as Actor[];
  } catch (error) {
    console.error("Error searching actors:", error);
    toast.error("Failed to search actors");
    return [];
  }
};

// Function to fetch movie trailers
export const fetchMovieTrailers = async (movieId: number): Promise<string | null> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
    if (!response.ok) throw new Error("Failed to fetch movie trailers");
    
    const data = await response.json();
    const trailers = data.results.filter(
      (video: any) => video.type === "Trailer" && video.site === "YouTube"
    );
    
    // Return the key of the first trailer, or null if no trailers are found
    return trailers.length > 0 ? trailers[0].key : null;
  } catch (error) {
    console.error(`Error fetching trailers for movie ${movieId}:`, error);
    toast.error("Failed to load movie trailer");
    return null;
  }
};

// Mock functions for storing user data
const STORAGE_KEY_REVIEWS = "movieLens_reviews";
const STORAGE_KEY_USER = "movieLens_user";

export const saveUserReview = (movieId: number, review: Omit<UserReview, "id" | "createdAt">): UserReview => {
  const storedReviews = localStorage.getItem(STORAGE_KEY_REVIEWS);
  const reviews: Record<number, UserReview[]> = storedReviews ? JSON.parse(storedReviews) : {};
  
  const newReview: UserReview = {
    ...review,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  if (!reviews[movieId]) {
    reviews[movieId] = [];
  }
  
  reviews[movieId].push(newReview);
  localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  
  return newReview;
};

export const getMovieReviews = (movieId: number): UserReview[] => {
  const storedReviews = localStorage.getItem(STORAGE_KEY_REVIEWS);
  if (!storedReviews) return [];
  
  const reviews: Record<number, UserReview[]> = JSON.parse(storedReviews);
  return reviews[movieId] || [];
};

export const saveUserProfile = (user: User): void => {
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
};

export const getUserProfile = (): User | null => {
  const storedUser = localStorage.getItem(STORAGE_KEY_USER);
  if (!storedUser) return null;
  
  return JSON.parse(storedUser);
};
