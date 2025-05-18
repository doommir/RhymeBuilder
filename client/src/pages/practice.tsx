import PracticeMode from "@/components/PracticeMode";
import BottomNavigation from "@/components/BottomNavigation";
import { useUser } from "@/hooks/use-user";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function PracticePage() {
  const { user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  // If no user is logged in, check localStorage before redirecting
  useEffect(() => {
    if (!isLoading && !user) {
      // Check if username exists in localStorage
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        // If username exists but user state is empty, refresh the page to load from localStorage
        window.location.reload();
      } else {
        // No username stored, redirect to login
        setLocation("/");
      }
    }
  }, [user, isLoading, setLocation]);

  return (
    <div className="pb-20">
      <PracticeMode />
      <BottomNavigation active="practice" />
    </div>
  );
}