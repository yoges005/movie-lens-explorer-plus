
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Image as ImageIcon, Send } from "lucide-react";
import { toast } from "sonner";
import { saveUserReview, getMovieReviews, Movie, UserReview } from "@/services/api";
import { useUser } from "@/contexts/UserContext";

interface MovieReviewProps {
  movie: Movie;
  onReviewAdded: () => void;
}

const MovieReview = ({ movie, onReviewAdded }: MovieReviewProps) => {
  const { user, isAuthenticated } = useUser();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleStarHover = (value: number) => {
    setHoverRating(value);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setTempPhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!review.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      saveUserReview(movie.id, {
        userId: user?.id || "guest",
        userName: user?.name || "Guest",
        userPhotoUrl: user?.photoURL,
        rating,
        review,
        photoUrl: tempPhoto,
      });

      toast.success("Review submitted successfully");
      setRating(0);
      setReview("");
      setTempPhoto(null);
      onReviewAdded();
    } catch (error) {
      console.error("Error saving review:", error);
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="space-y-4 p-4 bg-movieLens-gray rounded-lg">
      <h3 className="text-lg font-semibold">Write a Review</h3>
      
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            size={24}
            className={`cursor-pointer ${
              value <= (hoverRating || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-400"
            }`}
            onClick={() => handleStarClick(value)}
            onMouseEnter={() => handleStarHover(value)}
            onMouseLeave={() => setHoverRating(0)}
          />
        ))}
        <span className="ml-2 text-sm text-gray-300">
          {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "Rate this movie"}
        </span>
      </div>
      
      <Textarea
        placeholder="Share your thoughts about this movie..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="bg-movieLens-dark border-gray-700 text-white resize-none min-h-[100px]"
      />
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <label
            htmlFor="review-photo"
            className="cursor-pointer flex items-center gap-1 text-sm text-gray-300 hover:text-white"
          >
            <ImageIcon size={16} />
            Add Photo
          </label>
          <Input
            id="review-photo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        
        {tempPhoto && (
          <div className="relative w-16 h-16 overflow-hidden rounded">
            <img
              src={tempPhoto}
              alt="Review"
              className="w-full h-full object-cover"
            />
            <button
              className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
              onClick={() => setTempPhoto(null)}
            >
              <X size={14} />
            </button>
          </div>
        )}
        
        <Button
          onClick={handleSubmit}
          className="ml-auto bg-movieLens-blue hover:bg-blue-700 flex items-center gap-2"
        >
          <Send size={16} />
          Submit Review
        </Button>
      </div>
    </div>
  );
};

export const ReviewsList = ({ movieId }: { movieId: number }) => {
  const reviews = getMovieReviews(movieId);
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No reviews yet. Be the first to review!
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">User Reviews</h3>
      
      {reviews.map((review) => (
        <div key={review.id} className="p-4 bg-movieLens-dark rounded-lg">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={review.userPhotoUrl} alt={review.userName} />
              <AvatarFallback className="bg-movieLens-blue">
                {review.userName.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{review.userName}</div>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}
                      />
                    ))}
                    <span className="ml-2 text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="mt-2 text-gray-300">{review.review}</p>
              
              {review.photoUrl && (
                <div className="mt-3">
                  <img
                    src={review.photoUrl}
                    alt="Review"
                    className="max-h-40 rounded object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieReview;
