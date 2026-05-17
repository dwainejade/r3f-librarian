import { create } from 'zustand';

const GENRES = ['fantasy', 'mystery', 'scifi', 'romance'];

function generateScatteredBooks(count = 15) {
  const books = [];

  for (let i = 0; i < count; i++) {
    books.push({
      id: i + 1,
      name: `Vol ${i + 1}`,
      genre: GENRES[Math.floor(Math.random() * GENRES.length)],
      position: [
        (Math.random() - 0.5) * 20,
        Math.random() * 3,
        (Math.random() - 0.5) * 20
      ],
      collected: false
    });
  }

  return books;
}

export const useBookStore = create((set) => ({
  allBooks: generateScatteredBooks(),
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

  setHoveredObjectName: (name) =>
    set({ hoveredObjectName: name }),

  resetBooks: () =>
    set({
      allBooks: generateScatteredBooks(),
      collectedBooks: []
    })
}));
