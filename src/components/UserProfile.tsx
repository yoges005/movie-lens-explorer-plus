
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IMAGE_SIZES, User } from "@/services/api";
import { useUser } from "@/contexts/UserContext";
import { User as UserIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile = ({ isOpen, onClose }: UserProfileProps) => {
  const { user, updateUser, updateUserPhoto } = useUser();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photoURL, setPhotoURL] = useState<string | undefined>(user?.photoURL);
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    const updatedUser: User = {
      id: user?.id || Date.now().toString(),
      name,
      email,
      photoURL: tempPhoto || photoURL,
    };

    updateUser(updatedUser);
    toast.success("Profile updated successfully");
    onClose();
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

  const clearTempPhoto = () => {
    setTempPhoto(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-movieLens-gray text-white border-none">
        <DialogHeader>
          <DialogTitle className="text-xl">User Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={tempPhoto || photoURL}
                  alt={name}
                />
                <AvatarFallback className="bg-movieLens-blue text-white text-xl">
                  {name.charAt(0)?.toUpperCase() || <UserIcon />}
                </AvatarFallback>
              </Avatar>
              
              {tempPhoto && (
                <Button
                  variant="ghost" 
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-700"
                  onClick={clearTempPhoto}
                >
                  <X size={14} />
                </Button>
              )}
            </div>
            
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label
                htmlFor="picture"
                className="cursor-pointer flex items-center justify-center gap-2 text-sm text-movieLens-blue"
              >
                <Upload size={16} />
                Upload Photo
              </Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 bg-movieLens-dark border-movieLens-gray"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3 bg-movieLens-dark border-movieLens-gray"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-white/20 text-white">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-movieLens-blue hover:bg-blue-700">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
