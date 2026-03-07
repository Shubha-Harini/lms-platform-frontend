import { create } from 'zustand';

interface CourseState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  activeFilter: 'All',
  setActiveFilter: (activeFilter) => set({ activeFilter }),
}));
