import { useState } from 'react';
import Book from './Book';

export default function Books({ books, onBookPlaced, onPickup }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [validation, setValidation] = useState({});

  const handleBookClick = (book) => {
    setSelectedBook(selectedBook?.id === book.id ? null : book);
  };

  const handleBookDropped = (book, shelfId) => {
    const isCorrect = book.genre === shelfId;

    // Flash validation
    setValidation(prev => ({
      ...prev,
      [book.id]: isCorrect ? 'correct' : 'incorrect'
    }));

    // Reset flash after 500ms
    setTimeout(() => {
      setValidation(prev => {
        const newState = { ...prev };
        delete newState[book.id];
        return newState;
      });
    }, 500);

    onBookPlaced(book.id, shelfId);
    setSelectedBook(null);
  };

  return (
    <group>
      {books.map((book) => (
        <Book
          key={book.id}
          book={book}
          isSelected={selectedBook?.id === book.id}
          validation={validation[book.id]}
          onSelect={() => handleBookClick(book)}
          onDropped={handleBookDropped}
          onPickup={onPickup}
        />
      ))}
    </group>
  );
}
