
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User, getUserProfile, saveUserProfile } from "@/services/api";

interface UserContextType {
  user: User | null;
  theme: "dark" | "light";
  isAuthenticated: boolean;
  updateUser: (user: User) => void;
  updateUserPhoto: (photoURL: string) => void;
  toggleTheme: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// For localStorage key consistency
const STORAGE_KEY_USER = "movieLens_user";
const STORAGE_KEY_USERS = "movieLens_users";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  
  useEffect(() => {
    // Load user from localStorage
    const storedUser = getUserProfile();
    if (storedUser) {
      setUser(storedUser);
    }
    
    // Check for theme preference
    const storedTheme = localStorage.getItem("movieLens_theme");
    if (storedTheme && (storedTheme === "dark" || storedTheme === "light")) {
      setTheme(storedTheme);
    }
    
    // Initialize users array if not exists
    if (!localStorage.getItem(STORAGE_KEY_USERS)) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([]));
    }
  }, []);
  
  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("movieLens_theme", theme);
  }, [theme]);
  
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    saveUserProfile(updatedUser);
  };
  
  const updateUserPhoto = (photoURL: string) => {
    if (user) {
      const updatedUser = { ...user, photoURL };
      setUser(updatedUser);
      saveUserProfile(updatedUser);
    }
  };
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  };
  
  return (
    <UserContext.Provider
      value={{
        user,
        theme,
        isAuthenticated: !!user,
        updateUser,
        updateUserPhoto,
        toggleTheme,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
