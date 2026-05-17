import { GENRE_COLORS } from './colors';

export default function InventoryUI({ books }) {
  return (
    <div style={{
      position: 'fixed',
      right: 20,
      top: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxHeight: '80vh',
      overflow: 'auto',
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ color: '#fff', fontSize: '14px', marginBottom: '5px' }}>
        Books Collected: {books.length}
      </div>
      {books.map((book, idx) => (
        <div key={book.id} style={{
          width: '80px',
          height: '100px',
          backgroundColor: GENRE_COLORS[book.genre],
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '5px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          transform: `translateX(${idx * 2}px) translateY(${idx * 2}px)`
        }}>
          {book.genre}
        </div>
      ))}
    </div>
  );
}
