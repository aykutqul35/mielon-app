import { create } from 'zustand';

export type Species = 'Cat' | 'Dog' | null;

interface HotelState {
  checkInDate: string | null;
  checkOutDate: string | null;
  species: Species;
  breed: string;
  age: string;
  setDates: (checkIn: string, checkOut: string) => void;
  clearDates: () => void;
  setSpecies: (species: Species) => void;
  setBreed: (breed: string) => void;
  setAge: (age: string) => void;
  resetForm: () => void;
}

export const useHotelStore = create<HotelState>((set) => ({
  checkInDate: null,
  checkOutDate: null,
  species: null,
  breed: '',
  age: '',
  setDates: (checkIn, checkOut) => set({ checkInDate: checkIn, checkOutDate: checkOut }),
  clearDates: () => set({ checkInDate: null, checkOutDate: null }),
  setSpecies: (species) => set({ species }),
  setBreed: (breed) => set({ breed }),
  setAge: (age) => set({ age }),
  resetForm: () => set({
    checkInDate: null,
    checkOutDate: null,
    species: null,
    breed: '',
    age: '',
  }),
}));
