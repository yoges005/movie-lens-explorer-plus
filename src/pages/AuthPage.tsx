
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Film, Eye, EyeOff, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

type UserCredentials = {
  email: string;
  password: string;
  name?: string;
  photoURL?: string;
};

// Sample user database for demo purposes
const DEMO_USERS = [
  {
    email: "user@example.com",
    password: "password123",
    name: "Demo User",
    id: "user-1",
    photoURL: "",
    favoriteMovies: [],
    watchlist: [],
    reviews: []
  },
  {
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    id: "admin-1",
    photoURL: "",
    favoriteMovies: [],
    watchlist: [],
    reviews: []
  }
];

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("signin");
  const [credentials, setCredentials] = useState<UserCredentials>({
    email: "",
    password: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser, theme, toggleTheme } = useUser();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("movieLens_user");
    if (storedUser) {
      navigate("/");
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!credentials.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!credentials.password) {
      newErrors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (activeTab === "signup" && !credentials.name) {
      newErrors.name = "Name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    // Demo authentication with timeout to simulate API call
    setTimeout(() => {
      // Check against our demo users - case-insensitive email comparison
      const user = DEMO_USERS.find(
        (user) => 
          user.email.toLowerCase() === credentials.email.toLowerCase() && 
          user.password === credentials.password
      );
      
      if (user) {
        updateUser({
          id: user.id,
          email: user.email,
          name: user.name,
          photoURL: user.photoURL,
        });
        toast.success("Signed in successfully!");
        
        // Redirect to the page they were trying to access or to home
        const from = location.state?.from || "/";
        navigate(from);
      } else {
        // If no matching user is found
        toast.error("Invalid email or password");
        setErrors({
          auth: "Invalid email or password combination"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    // Check if email already exists
    const emailExists = DEMO_USERS.some(
      (user) => user.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (emailExists) {
      toast.error("Email already registered");
      setErrors({
        email: "This email is already registered"
      });
      setIsLoading(false);
      return;
    }

    // Simulate registration
    setTimeout(() => {
      // Create a new user profile
      const newUserId = "user-" + Date.now();
      const user = {
        id: newUserId,
        email: credentials.email,
        name: credentials.name || "",
        photoURL: "",
        favoriteMovies: [],
        watchlist: [],
        reviews: []
      };
      
      // Add new user to DEMO_USERS for future sign-ins within this session
      DEMO_USERS.push({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name || "",
        id: newUserId,
        photoURL: "",
        favoriteMovies: [],
        watchlist: [],
        reviews: []
      });
      
      updateUser(user);
      toast.success("Account created successfully!");
      navigate("/");
      
      setIsLoading(false);
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), 
                          url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2225&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Theme toggle button */}
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleTheme}
        className="absolute top-4 right-4 border-white/20 bg-black/40 hover:bg-black/60 text-white"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </Button>

      <div className="mb-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <Film className="h-8 w-8 md:h-10 md:w-10 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary movie-title">MovieLens</h1>
        </div>
        <p className="text-muted-foreground text-center text-sm md:text-base">Your ultimate movie discovery platform</p>
      </div>

      <Card className={cn(
        "w-full max-w-md border-white/10",
        theme === "dark" ? "bg-black/70 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"
      )}>
        <CardHeader>
          <CardTitle className="text-center">Welcome to MovieLens</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={credentials.email}
                      onChange={handleInputChange}
                      required
                      className={cn(
                        theme === "light" ? "bg-white border-gray-300" : "",
                        errors.email ? "border-red-500" : ""
                      )}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={credentials.password}
                        onChange={handleInputChange}
                        required
                        className={cn(
                          theme === "light" ? "bg-white border-gray-300 pr-10" : "pr-10",
                          errors.password ? "border-red-500" : ""
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    <div className="text-xs text-muted-foreground mt-1">
                      Demo: user@example.com / password123
                    </div>
                  </div>
                  {errors.auth && <p className="text-red-500 text-sm">{errors.auth}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Name</Label>
                    <Input
                      id="signup-name"
                      name="name"
                      placeholder="Your name"
                      value={credentials.name}
                      onChange={handleInputChange}
                      required
                      className={cn(
                        theme === "light" ? "bg-white border-gray-300" : "",
                        errors.name ? "border-red-500" : ""
                      )}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={credentials.email}
                      onChange={handleInputChange}
                      required
                      className={cn(
                        theme === "light" ? "bg-white border-gray-300" : "",
                        errors.email ? "border-red-500" : ""
                      )}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={credentials.password}
                        onChange={handleInputChange}
                        required
                        className={cn(
                          theme === "light" ? "bg-white border-gray-300 pr-10" : "pr-10",
                          errors.password ? "border-red-500" : ""
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-xs sm:text-sm text-muted-foreground">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
