import { Canvas } from '@react-three/fiber';
import FirstPersonCamera from './FirstPersonCamera';
import { Sky } from '@react-three/drei';
import Books from './Books';
import InventoryUI from './InventoryUI';
import { useBookStore } from '../store/bookStore';

export default function Scene() {
  const allBooks = useBookStore((state) => state.allBooks);
  const collectedBooks = useBookStore((state) => state.collectedBooks);
  const pickupBook = useBookStore((state) => state.pickupBook);
  const placeBook = useBookStore((state) => state.placeBook);

  const visibleBooks = allBooks.filter(b => !b.collected);

  const handlePickupBook = (bookId) => {
    pickupBook(bookId);
  };

  const handleBookPlaced = (bookId, shelfId) => {
    placeBook(bookId, shelfId);
  };

  return (
    <>
      <Canvas camera={{ position: [0, 1.6, 5], fov: 75 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Sky sunPosition={[120, 200, 100]} />

        <FirstPersonCamera position={[0, 1.6, 5]} />
        <Books books={visibleBooks} onBookPlaced={handleBookPlaced} onPickup={handlePickupBook} />

        {/* Ground plane */}
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#90EE90" />
        </mesh>
      </Canvas>

      <InventoryUI books={collectedBooks} />
    </>
  );
}
