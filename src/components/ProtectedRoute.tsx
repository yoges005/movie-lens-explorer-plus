
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to access this page");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    // Redirect to auth page but remember where the user was trying to go
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
