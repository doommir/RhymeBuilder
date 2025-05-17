import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { calculateLevel } from '@/lib/lesson-data';

interface User {
  id?: number;
  username: string;
  xp: number;
  streak: number;
  lastActive: string;
  completedLessons: string[];
  level?: number; // Computed based on XP
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Add computed level property to user
  const userWithLevel = user ? {
    ...user,
    level: calculateLevel(user.xp)
  } : null;

  useEffect(() => {
    // Load user from localStorage on initial render
    const storedUser = localStorage.getItem('flowTrainerUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Check if we need to update streak
      const lastActive = new Date(parsedUser.lastActive || 0);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // If last active was before yesterday, reset streak
      if (lastActive < yesterday) {
        if (lastActive.toDateString() === yesterday.toDateString()) {
          // User was active yesterday, increment streak
          parsedUser.streak += 1;
        } else {
          // User wasn't active yesterday, reset streak
          parsedUser.streak = 1;
        }
      }
      
      // Update last active
      parsedUser.lastActive = today.toISOString();
      localStorage.setItem('flowTrainerUser', JSON.stringify(parsedUser));
      
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string) => {
    try {
      const response = await apiRequest('POST', '/api/users', { username });
      const userData = await response.json();
      
      // Prepare user data with gamification features
      const today = new Date();
      const enhancedUser = {
        ...userData,
        streak: userData.streak || 1,
        lastActive: userData.lastActive || today.toISOString(),
        completedLessons: userData.completedLessons || []
      };
      
      // Store user in localStorage
      localStorage.setItem('flowTrainerUser', JSON.stringify(enhancedUser));
      setUser(enhancedUser);
      return enhancedUser;
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to local storage for demo purposes
      const today = new Date();
      const newUser = { 
        username, 
        xp: 0,
        streak: 1,
        lastActive: today.toISOString(),
        completedLessons: []
      };
      localStorage.setItem('flowTrainerUser', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    }
  };

  const updateXP = async (newXP: number) => {
    if (!user) return null;

    try {
      // Try to update XP via API
      await apiRequest('PUT', `/api/users/${user.username}/xp`, { xp: newXP });
      
      // Update local state
      const updatedUser = { ...user, xp: newXP };
      localStorage.setItem('flowTrainerUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating XP:', error);
      
      // Fallback to local storage for demo purposes
      const updatedUser = { ...user, xp: newXP };
      localStorage.setItem('flowTrainerUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    }
  };

  const completeLesson = async (lessonId: string, earnedXp: number) => {
    if (!user) return null;
    
    // Make sure we don't add duplicate completed lessons
    const completedLessons = user.completedLessons.includes(lessonId) 
      ? user.completedLessons 
      : [...user.completedLessons, lessonId];
    
    const newXp = user.xp + earnedXp;
    
    try {
      // Update user with earned XP and completed lesson
      const updatedUser = { 
        ...user, 
        xp: newXp,
        completedLessons 
      };
      
      localStorage.setItem('flowTrainerUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error completing lesson:', error);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('flowTrainerUser');
    setUser(null);
  };

  return {
    user: userWithLevel,
    isLoading,
    login,
    updateXP,
    completeLesson,
    logout,
  };
}
