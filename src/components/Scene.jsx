import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, Stats } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import FirstPersonCamera from "./FirstPersonCamera";
import Books from "./Books";
import InventoryUI from "./InventoryUI";
import { useBookStore } from "../store/bookStore";

export default function Scene() {
  const collectedBooks = useBookStore((state) => state.collectedBooks);
  const pickupBook = useBookStore((state) => state.pickupBook);

  // --- WIDE PILE SCATTER Math ---
  const testBooks = useMemo(() => {
    const totalBooks = 1000;
    const spawnRadius = 3; // How far outward the books scatter horizontally (in meters)
    const heightPerLayer = 0.08; // Pack them tighter vertically so they drop together in a wave

    return Array.from({ length: totalBooks }).map((_, index) => {
      // 1. Use random polar coordinates (angle and radius) to distribute across a solid circle
      const angle = Math.random() * Math.PI * 2;

      // Using Math.sqrt ensures an even distribution across the circle area
      // instead of bunching up heavily in the dead center
      const radius = Math.sqrt(Math.random()) * spawnRadius;

      const posX = Math.cos(angle) * radius;
      const posZ = Math.sin(angle) * radius;

      // 2. Stack them up in layers starting slightly above the floor
      const posY = 1.0 + index * heightPerLayer;

      return {
        id: `test-book-${index}`,
        name: `Book_${index}`,
        genre: ["fantasy", "mystery", "scifi", "romance"][index % 4],
        position: [posX, posY, posZ],
        collected: false,
      };
    });
  }, []); // Wrapped in useMemo so it doesn't regenerate and trigger a cascade every render frame

  return (
    <>
      <Canvas camera={{ position: [0, 1.6, 5], fov: 75 }}>
        <Stats />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Sky sunPosition={[120, 200, 100]} />

        <Physics gravity={[0, -9.81, 0]}>
          <FirstPersonCamera position={[0, 1.6, 6]} />

          <Books books={testBooks} onPickup={pickupBook} />

          {/* The Floor */}
          <RigidBody type="fixed" friction={1.0}>
            <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[40, 40]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
          </RigidBody>
        </Physics>
      </Canvas>

      <InventoryUI books={collectedBooks} />
    </>
  );
}
