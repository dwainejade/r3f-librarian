import { Canvas } from "@react-three/fiber";
import { Sky, Stats } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import {
  Selection,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";
import FirstPersonCamera from "./FirstPersonCamera";
import Books from "./Books";
import InventoryUI from "./InventoryUI";
import { useBookStore } from "../store/bookStore";

// Dedicated Hover HUD Component
// This is the ONLY UI element that re-renders when your crosshair points at a book,
// keeping the heavy 3D Canvas completely undisturbed!
function HoverHUD() {
  const hoveredName = useBookStore((state) => state.hoveredObjectName);
  if (!hoveredName) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "52%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "#ffffff",
        fontFamily: "monospace",
        pointerEvents: "none",
        fontSize: "18px",
        textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
        zIndex: 10,
      }}
    >
      {hoveredName}
    </div>
  );
}

export default function Scene() {
  const allBooks = useBookStore((state) => state.allBooks);
  const collectedBooks = useBookStore((state) => state.collectedBooks);
  const pickupBook = useBookStore((state) => state.pickupBook);

  // Filter out collected items so picked-up books disappear from the instanced array
  const activeBooks = allBooks.filter((b) => !b.collected);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas camera={{ position: [0, 1.6, 5], fov: 75 }}>
        <Stats />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Sky sunPosition={[120, 200, 100]} />

        <Selection>
          <EffectComposer autoClear={false}>
            <Outline
              blur
              edgeStrength={10}
              edgeGlow={0.5}
              visibleEdgeColor={0xffffff}
              hiddenEdgeColor={0xffffff}
            />
          </EffectComposer>

          <Physics gravity={[0, -9.81, 0]}>
            <FirstPersonCamera position={[0, 1.6, 6]} />

            {/* Feeds active books directly out of Zustand */}
            <Books books={activeBooks} onPickup={pickupBook} />

            {/* The Floor */}
            <RigidBody type="fixed" friction={1.0}>
              <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[40, 40]} />
                <meshStandardMaterial color="#1a1a1a" />
              </mesh>
            </RigidBody>
          </Physics>
        </Selection>
      </Canvas>

      {/* Overlays */}
      <HoverHUD />
      <InventoryUI books={collectedBooks} />
    </div>
  );
}
