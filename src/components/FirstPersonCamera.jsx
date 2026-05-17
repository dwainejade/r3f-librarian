import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useBookStore } from '../store/bookStore';

export default function FirstPersonCamera({ position = [0, 1.6, 5] }) {
  const { camera } = useThree();
  const keysPressed = useRef({});
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const velocity = useRef(new THREE.Vector3());
  const setHoveredObjectName = useBookStore((state) => state.setHoveredObjectName);
  const hoveredObjectName = useBookStore((state) => state.hoveredObjectName);

  const SPEED = 0.05;
  const MOUSE_SENSITIVITY = 0.005;

  useEffect(() => {
    // Initialize camera position
    camera.position.set(...position);

    // Request pointer lock on click
    const handleClick = () => {
      document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock;
      document.body.requestPointerLock();
    };

    // Handle mouse movement for camera rotation
    const handleMouseMove = (e) => {
      if (document.pointerLockElement === document.body) {
        euler.current.setFromQuaternion(camera.quaternion, 'YXZ');
        euler.current.y -= e.movementX * MOUSE_SENSITIVITY;
        euler.current.x -= e.movementY * MOUSE_SENSITIVITY;

        // Clamp x rotation to prevent flipping
        euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
        camera.quaternion.setFromEuler(euler.current);
      }
    };

    // Track key presses
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    document.body.addEventListener('click', handleClick);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.body.removeEventListener('click', handleClick);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [camera, position]);

  useFrame(() => {
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    right.crossVectors(camera.up, forward);

    velocity.current.set(0, 0, 0);

    if (keysPressed.current['w']) velocity.current.add(forward.multiplyScalar(SPEED));
    if (keysPressed.current['s']) velocity.current.add(forward.multiplyScalar(-SPEED));
    if (keysPressed.current['a']) velocity.current.add(right.multiplyScalar(SPEED));
    if (keysPressed.current['d']) velocity.current.add(right.multiplyScalar(-SPEED));

    camera.position.add(velocity.current);
  });


  useFrame(({ raycaster, scene }) => {
    // 1. Set the raycaster to the exact center of the screen (0, 0)
    raycaster.setFromCamera({ x: 0, y: 0 }, raycaster.camera);

    // 2. Get all objects currently intersecting the center point
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      // 3. The first object in the array is closest to the camera
      const closestObject = intersects[0].object;
      setHoveredObjectName(closestObject.name);
      console.log({hoveredObjectName});
    } else {
      setHoveredObjectName(null);
    }
  });


  return null;

}
