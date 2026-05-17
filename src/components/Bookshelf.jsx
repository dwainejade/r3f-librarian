import { useRef } from 'react';
import { Html } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

export default function Bookshelf({ shelves }) {
  const shelfRefs = useRef({});

  return (
    <group>
      {/* Background wall */}
      <mesh position={[0.5, 1, -0.5]}>
        <planeGeometry args={[8, 3]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>

      {/* Shelves */}
      {shelves.map((shelf) => (
        <group key={shelf.id} ref={el => shelfRefs.current[shelf.id] = el}>
          {/* Shelf board */}
          <RigidBody type="fixed">
    <mesh position={[shelf.position[0], shelf.position[1], shelf.position[2]]}>
      <boxGeometry args={[0.8, 0.1, 0.4]} />
      <meshStandardMaterial color="#8b7355" />
    </mesh>
  </RigidBody>

          {/* Shelf label using HTML */}
          <Html position={[shelf.position[0], shelf.position[1] + 0.35, shelf.position[2]]}>
            <div style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'center',
              width: '80px',
              userSelect: 'none'
            }}>
              {shelf.label}
            </div>
          </Html>

          {/* Validation flash indicator - currently unused */}
        </group>
      ))}
    </group>
  );
}
