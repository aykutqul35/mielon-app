import { create } from 'zustand';

export type Species = 'Cat' | 'Dog' | null;

interface GroomingState {
  species: Species;
  breed: string;
  age: string;
  weight: string;
  photos: string[];
  setSpecies: (species: Species) => void;
  setBreed: (breed: string) => void;
  setAge: (age: string) => void;
  setWeight: (weight: string) => void;
  addPhotos: (newPhotos: string[]) => void;
  removePhoto: (index: number) => void;
  resetForm: () => void;
}

export const useGroomingStore = create<GroomingState>((set) => ({
  species: null,
  breed: '',
  age: '',
  weight: '',
  photos: [],
  setSpecies: (species) => set({ species }),
  setBreed: (breed) => set({ breed }),
  setAge: (age) => set({ age }),
  setWeight: (weight) => set({ weight }),
  addPhotos: (newPhotos) => set((state) => {
    const combined = [...state.photos, ...newPhotos];
    return { photos: combined.slice(0, 4) }; // max 4 photos limit
  }),
  removePhoto: (index) => set((state) => ({
    photos: state.photos.filter((_, i) => i !== index),
  })),
  resetForm: () => set({
    species: null,
    breed: '',
    age: '',
    weight: '',
    photos: [],
  }),
}));
