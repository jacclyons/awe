import { useState, useCallback, useEffect } from 'react';
import type { AWECharacter } from "@/types/awe";

const STORAGE_KEY = 'awe-characters';

function loadFromStorage(): AWECharacter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AWECharacter[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(characters: AWECharacter[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
}

export function useCharacters() {
  const [characters, setCharacters] = useState<AWECharacter[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCharacters(loadFromStorage());
    setLoaded(true);
  }, []);

  const persist = useCallback((next: AWECharacter[]) => {
    setCharacters(next);
    saveToStorage(next);
  }, []);

  const addCharacter = useCallback(
    (character: AWECharacter) => {
      persist([...characters, character]);
    },
    [characters, persist]
  );

  const updateCharacter = useCallback(
    (id: string, updates: Partial<AWECharacter>) => {
      persist(
        characters.map((c) =>
          c.id === id
            ? { ...c, ...updates, updatedAt: Date.now() }
            : c
        )
      );
    },
    [characters, persist]
  );

  const deleteCharacter = useCallback(
    (id: string) => {
      persist(characters.filter((c) => c.id !== id));
    },
    [characters, persist]
  );

  const getCharacter = useCallback(
    (id: string) => characters.find((c) => c.id === id) ?? null,
    [characters]
  );

  return {
    characters,
    loaded,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    getCharacter,
  };
}
