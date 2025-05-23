import { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useToast } from '@/hooks/use-toast';

export type RhymePadEntry = {
  id: string;
  content: string;
  tags: string[];
  addedFrom: 'manual' | 'lesson' | 'freestyle';
  lessonId?: string;
  dateCreated: string;
  isFavorite: boolean;
};

// Global variable to store the add entry function
let globalAddEntryFn: ((entry: Omit<RhymePadEntry, 'id' | 'dateCreated'>) => RhymePadEntry) | null = null;

export const saveToRhymePad = (
  content: string, 
  tags: string[], 
  lessonId: string
): boolean => {
  if (!globalAddEntryFn) {
    console.error('RhymePad not initialized yet!');
    return false;
  }
  
  try {
    globalAddEntryFn({
      content,
      tags,
      addedFrom: 'lesson',
      lessonId,
      isFavorite: false
    });
    return true;
  } catch (error) {
    console.error('Failed to save to RhymePad:', error);
    return false;
  }
};

export function useRhymePad() {
  const [entries, setEntries] = useState<RhymePadEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load entries from localStorage on initial render
  useEffect(() => {
    const storedEntries = localStorage.getItem('userRhymePad');
    if (storedEntries) {
      try {
        setEntries(JSON.parse(storedEntries));
      } catch (error) {
        console.error('Error parsing stored rhyme pad entries:', error);
        // If there's an error parsing, initialize with empty array
        setEntries([]);
      }
    }
    setIsLoading(false);
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('userRhymePad', JSON.stringify(entries));
    }
  }, [entries, isLoading]);

  const addEntry = (entry: Omit<RhymePadEntry, 'id' | 'dateCreated'>) => {
    const newEntry: RhymePadEntry = {
      ...entry,
      id: uuid(),
      dateCreated: new Date().toISOString()
    };
    
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  };
  
  // Register the global addEntry function
  useEffect(() => {
    globalAddEntryFn = addEntry;
    
    return () => {
      globalAddEntryFn = null;
    };
  }, []);

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { ...entry, isFavorite: !entry.isFavorite } 
          : entry
      )
    );
  };

  const getAllEntries = () => entries;
  
  const getFavorites = () => entries.filter(entry => entry.isFavorite);
  
  const getByTag = (tag: string) => entries.filter(entry => 
    entry.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );

  return {
    entries,
    isLoading,
    addEntry,
    deleteEntry,
    toggleFavorite,
    getAllEntries,
    getFavorites,
    getByTag
  };
}