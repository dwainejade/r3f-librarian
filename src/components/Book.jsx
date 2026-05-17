import { RigidBody } from "@react-three/rapier";
import { GENRE_COLORS } from "./colors";

export default function Book({ book, onPickup, rbRefs }) {
  const color = GENRE_COLORS[book.genre] || "#ffffff";

  return (
    <RigidBody
      ref={(el) => {
        if (el) rbRefs.current[book.id] = el;
      }}
      position={book.position}
      rotation={[
        Math.random() * 0.2,
        Math.random() * Math.PI,
        Math.random() * 0.2,
      ]}
      type="dynamic"
      colliders="cuboid"
      restitution={0.02}
      friction={1.5}
      mass={2}
    >
      <mesh
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          if (onPickup) onPickup(book.id);
        }}
      >
        <boxGeometry args={[0.3, 0.4, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
    </RigidBody>
  );
}
