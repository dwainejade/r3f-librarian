import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import Book from "./Book";

export default function Books({ books, onPickup }) {
  const rbRefs = useRef({});
  const hasFrozenAll = useRef(false);
  const spawnTime = useRef(Date.now());

  // Reset the freeze flag if the book list changes (e.g., new pile drops)
  useEffect(() => {
    hasFrozenAll.current = false;
    spawnTime.current = Date.now();

    // Force all books awake when they spawn
    Object.values(rbRefs.current).forEach((body) => {
      if (body) body.wakeUp();
    });
  }, [books]);

  useFrame(() => {
    // If we already froze the pile, stop checking to save CPU
    if (hasFrozenAll.current || !books || books.length === 0) return;

    // 1. Safety Buffer: Give books at least 1 second to actually start falling
    // before we start checking if they're "still"
    if (Date.now() - spawnTime.current < 1000) return;

    const bodies = Object.values(rbRefs.current).filter(Boolean);
    if (bodies.length === 0) return;

    // 2. Check if EVERY single book has stopped moving
    const allAreStill = bodies.every((body) => {
      const vel = body.linvel();
      // Calculate speed squared (x^2 + y^2 + z^2)
      const speedSq = vel.x * vel.x + vel.y * vel.y + vel.z * vel.z;
      // Is it moving slower than a microscopic fraction?
      return speedSq < 0.0005;
    });

    // 3. The exact millisecond the whole pile settles, turn them into solid terrain!
    if (allAreStill) {
      bodies.forEach((body) => {
        body.setBodyType(1); // 1 = Fixed / Static Terrain
      });
      hasFrozenAll.current = true;
      console.log(
        "💥 Pile has settled completely! All books frozen into solid stairs.",
      );
    }
  });

  return (
    <group>
      {books.map((book) => (
        <Book key={book.id} book={book} onPickup={onPickup} rbRefs={rbRefs} />
      ))}
    </group>
  );
}
