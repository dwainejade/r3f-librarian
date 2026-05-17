import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedRigidBodies } from "@react-three/rapier";
import { Select } from "@react-three/postprocessing";
import * as THREE from "three";
import { GENRE_COLORS } from "./colors";
import { useBookStore } from "../store/bookStore";
import Book from "./Book";

// Temporary math vectors to keep memory collection clear of leaks
const _matrix = new THREE.Matrix4();
const _position = new THREE.Vector3();
const _rotation = new THREE.Quaternion();
const _scale = new THREE.Vector3();

export default function Books({ books, onPickup }) {
  const meshRef = useRef();
  const rbRef = useRef([]);
  const ghostMeshRef = useRef();

  // Keep track of hover purely via references (No component state!)
  const lastHoveredIdxRef = useRef(null);
  const hasFrozenAll = useRef(false);
  const spawnTime = useRef(Date.now());

  const setHoveredObjectName = useBookStore(
    (state) => state.setHoveredObjectName,
  );

  const instances = useMemo(() => {
    if (!books) return [];
    return books.map((book) => ({
      key: book.id,
      position: book.position,
      rotation: [
        Math.random() * 0.2,
        Math.random() * Math.PI,
        Math.random() * 0.2,
      ],
    }));
  }, [books]);

  // Handle book coloring natively on GPU array allocation
  useEffect(() => {
    if (!meshRef.current || !books) return;
    const colorObj = new THREE.Color();
    books.forEach((book, index) => {
      const hexColor = GENRE_COLORS[book.genre] || "#ffffff";
      colorObj.set(hexColor);
      meshRef.current.setColorAt(index, colorObj);
    });
    meshRef.current.instanceColor.needsUpdate = true;
  }, [books]);

  useFrame(({ raycaster }) => {
    if (
      !books ||
      books.length === 0 ||
      !rbRef.current ||
      rbRef.current.length === 0
    )
      return;

    // A. FREEZE ENGINE MONITOR
    const age = Date.now() - spawnTime.current;
    if (!hasFrozenAll.current && age > 1500) {
      let allAreStill = true;
      for (let i = 0; i < rbRef.current.length; i++) {
        const body = rbRef.current[i];
        if (!body) continue;
        const vel = body.linvel();
        const speedSq = vel.x * vel.x + vel.y * vel.y + vel.z * vel.z;
        if (speedSq > 0.0005) {
          allAreStill = false;
          break;
        }
      }
      if (allAreStill) {
        rbRef.current.forEach((body) => {
          if (body) body.setBodyType(1);
        });
        hasFrozenAll.current = true;
        console.log("📚 Pile static optimization applied.");
      }
    }

    // B. COMPLETELY STATE-LESS INTERSECTION SELECTION
    if (!meshRef.current) return;
    raycaster.setFromCamera({ x: 0, y: 0 }, raycaster.camera);
    raycaster.far = 3.05;

    const intersects = raycaster.intersectObject(meshRef.current);

    if (intersects.length > 0 && intersects[0].instanceId !== undefined) {
      const activeIdx = intersects[0].instanceId;
      const targetBook = books[activeIdx];

      if (targetBook) {
        // Grab the raw transform matrices of the instance index
        meshRef.current.getMatrixAt(activeIdx, _matrix);
        _matrix.decompose(_position, _rotation, _scale);

        if (ghostMeshRef.current) {
          ghostMeshRef.current.position.copy(_position);
          ghostMeshRef.current.quaternion.copy(_rotation);
          // Directly manipulate visibility on the three node
          ghostMeshRef.current.visible = true;
        }

        // Only push UI text name adjustments to store when the item target shifts
        if (lastHoveredIdxRef.current !== activeIdx) {
          lastHoveredIdxRef.current = activeIdx;
          setHoveredObjectName(targetBook.name);
        }
      }
    } else {
      // If crosshair leaves looking at anything, reset references instantly
      if (lastHoveredIdxRef.current !== null) {
        lastHoveredIdxRef.current = null;
        setHoveredObjectName(null);
      }

      if (ghostMeshRef.current) {
        ghostMeshRef.current.visible = false;
      }
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    if (e.instanceId !== undefined && books[e.instanceId]) {
      const targetBook = books[e.instanceId];
      if (onPickup) onPickup(targetBook.id);
    }
  };

  if (!books || books.length === 0) return null;

  return (
    <group>
      {/* 1. Main GPU Instanced Simulation Container */}
      <InstancedRigidBodies
        ref={rbRef}
        instances={instances}
        colliders="cuboid"
        restitution={0.01}
        friction={1.5}
        mass={1}
      >
        <instancedMesh
          ref={meshRef}
          args={[null, null, books.length]}
          castShadow
          receiveShadow
          onPointerDown={handlePointerDown}
        >
          {/* 🚀 Clean, abstracted visual design component */}
          <Book />
        </instancedMesh>
      </InstancedRigidBodies>

      {/* 2. Unified Static Selection Ghost */}
      <Select enabled>
        <mesh ref={ghostMeshRef} visible={false}>
          <boxGeometry args={[0.152, 0.202, 0.052]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            wireframe
          />
        </mesh>
      </Select>
    </group>
  );
}
