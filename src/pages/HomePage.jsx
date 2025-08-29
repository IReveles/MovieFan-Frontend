import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Film, Star, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/store/userStore";
import MovieSearchBar from "../components/MovieSearchBar.jsx";

export default function HomePage() {
  const { user, clearUser } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  return (
    <div className="flex justify-center mt-6">
      <MovieSearchBar/>
    </div>
  );
}
