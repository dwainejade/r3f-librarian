import * as THREE from "three";

export default function BookGeometry() {
  return (
    <>
      {/* The parent <instancedMesh> will automatically duplicate whatever 
        geometry and material are placed inside it across all 3,000 entries.
      */}
      <boxGeometry args={[0.15, 0.2, 0.05]} />
      <meshStandardMaterial roughness={0.6} metalness={0.1} />
    </>
  );
}
