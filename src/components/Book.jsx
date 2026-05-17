import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import { GENRE_COLORS } from './colors';
import { useBookStore } from '../store/bookStore';

export default function Book({ book, isSelected, validation, onSelect, onPickup }) {
  const meshRef = useRef();
  const hoveredObjectName = useBookStore((state) => state.hoveredObjectName);
  const isHovered = hoveredObjectName === book.name;
  console.log({isHovered})

  useFrame(() => {
    if (!meshRef.current) return;

    if (isSelected) {
      meshRef.current.material.emissiveIntensity = 0.3;
    } else {
      meshRef.current.material.emissiveIntensity = isSelected ? 0.2 : 0;
    }
  });

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.name = book.name;
    }
  }, [book.name]);

  useEffect(() => {
    if (validation === 'correct') {
      meshRef.current.material.emissive.setHex(0x00ff00);
    } else if (validation === 'incorrect') {
      meshRef.current.material.emissive.setHex(0xff0000);
    } else {
      meshRef.current.material.emissive.setHex(0x000000);
    }
  }, [validation]);

  const handlePointerDown = () => {
    onSelect();
  };

  const handleClick = () => {
    if (onPickup) {
      onPickup(book.id);
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={book.position}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      <boxGeometry args={[0.15, 0.2, 0.05]} />
      <meshStandardMaterial
        color={GENRE_COLORS[book.genre]}
        emissive={0x000000}
        emissiveIntensity={0}
      />
      {isHovered && <Outlines color="white" thickness={0.01} />}
    </mesh>
  );
}
