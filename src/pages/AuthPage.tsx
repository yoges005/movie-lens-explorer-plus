
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (!credentials.email || !credentials.password) {
      toast.error("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    // Demo authentication with timeout to simulate API call
    setTimeout(() => {
      // Check against our demo users
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
        navigate("/");
      } else {
        // If no matching user is found
        toast.error("Invalid email or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (!credentials.email || !credentials.password || !credentials.name) {
      toast.error("Please fill all required fields");
      setIsLoading(false);
      return;
    }

    // Check if email already exists
    const emailExists = DEMO_USERS.some(
      (user) => user.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (emailExists) {
      toast.error("Email already registered");
      setIsLoading(false);
      return;
    }

    // Simulate registration
    setTimeout(() => {
      // Create a new user profile
      const user = {
        id: "user-" + Date.now(),
        email: credentials.email,
        name: credentials.name,
        photoURL: "",
        favoriteMovies: [],
        watchlist: [],
        reviews: []
      };
      
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
                      className={theme === "light" ? "bg-white border-gray-300" : ""}
                    />
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
                        className={theme === "light" ? "bg-white border-gray-300 pr-10" : "pr-10"}
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
                    <div className="text-xs text-muted-foreground mt-1">
                      Demo: user@example.com / password123
                    </div>
                  </div>
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
                      className={theme === "light" ? "bg-white border-gray-300" : ""}
                    />
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
                      className={theme === "light" ? "bg-white border-gray-300" : ""}
                    />
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
                        className={theme === "light" ? "bg-white border-gray-300 pr-10" : "pr-10"}
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
