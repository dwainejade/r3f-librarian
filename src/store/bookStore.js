import { create } from 'zustand';

const GENRES = [
  'fantasy', 'mystery', 'scifi', 'romance', 'thriller', 
  'horror', 'history', 'biography', 'poetry', 'adventure'
];

// High-performance pile scatter configuration
function generateScatteredBooks(count = 3000) {
  const books = [];
  const spawnRadius = 3.5;
  const heightPerLayer = 0.08;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * spawnRadius;
    const posX = Math.cos(angle) * radius;
    const posZ = Math.sin(angle) * radius;
    const posY = 1.0 + i * heightPerLayer;

    books.push({
      id: `test-book-${i}`,
      name: `Book_${i}`,
      // 🚀 Cycles through all 10 genres cleanly now!
      genre: GENRES[i % GENRES.length], 
      position: [posX, posY, posZ],
      collected: false
    });
  }

  return books;
}

export const useBookStore = create((set) => ({
  allBooks: generateScatteredBooks(1000), // Populates 3,000 books instantly
  collectedBooks: [],
  hoveredObjectName: null,

  pickupBook: (bookId) =>
    set((state) => {
      const book = state.allBooks.find((b) => b.id === bookId);
      if (!book || book.collected) return state;

      return {
        allBooks: state.allBooks.map((b) =>
          b.id === bookId ? { ...b, collected: true } : b
        ),
        collectedBooks: [...state.collectedBooks, book]
      };
    }),

  placeBook: (bookId, shelfId) =>
    set((state) => ({
      allBooks: state.allBooks.map((b) =>
        b.id === bookId ? { ...b, genre: shelfId } : b
      )
    })),

  setHoveredObjectName: (name) => set({ hoveredObjectName: name }),

  resetBooks: () =>
    set({
      allBooks: generateScatteredBooks(3000),
      collectedBooks: []
    })
}));