import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id?: number;
  username: string;
  xp: number;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on initial render
    const storedUser = localStorage.getItem('rhymeTimeUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string) => {
    try {
      const response = await apiRequest('POST', '/api/users', { username });
      const userData = await response.json();
      
      // Store user in localStorage
      localStorage.setItem('rhymeTimeUser', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      
      // Fallback to local storage for demo purposes
      const newUser = { username, xp: 0 };
      localStorage.setItem('rhymeTimeUser', JSON.stringify(newUser));
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
      localStorage.setItem('rhymeTimeUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error updating XP:', error);
      
      // Fallback to local storage for demo purposes
      const updatedUser = { ...user, xp: newXP };
      localStorage.setItem('rhymeTimeUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('rhymeTimeUser');
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    updateXP,
    logout,
  };
}
