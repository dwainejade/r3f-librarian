import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";

export default function FirstPersonCamera({ position = [0, 1.6, 5] }) {
  const { camera } = useThree();
  const playerRef = useRef();
  const keysPressed = useRef({});
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  const SPEED = 3.5;
  const MOUSE_SENSITIVITY = 0.003;

  useEffect(() => {
    const handleClick = () => {
      document.body.requestPointerLock?.();
    };
    const handleMouseMove = (e) => {
      if (document.pointerLockElement === document.body) {
        euler.current.setFromQuaternion(camera.quaternion, "YXZ");
        euler.current.y -= e.movementX * MOUSE_SENSITIVITY;
        euler.current.x -= e.movementY * MOUSE_SENSITIVITY;
        euler.current.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, euler.current.x),
        );
        camera.quaternion.setFromEuler(euler.current);
      }
    };

    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    document.body.addEventListener("click", handleClick);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.body.removeEventListener("click", handleClick);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [camera]);

  useFrame(() => {
    if (!playerRef.current) return;
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(camera.up, forward);

    const moveDirection = new THREE.Vector3(0, 0, 0);
    if (keysPressed.current["w"]) moveDirection.add(forward);
    if (keysPressed.current["s"]) moveDirection.add(forward.clone().negate());
    if (keysPressed.current["a"]) moveDirection.add(right);
    if (keysPressed.current["d"]) moveDirection.add(right.clone().negate());

    moveDirection.normalize().multiplyScalar(SPEED);
    const currentVelocity = playerRef.current.linvel();

    playerRef.current.setLinvel(
      {
        x: moveDirection.x,
        y: currentVelocity.y,
        z: moveDirection.z,
      },
      true,
    );

    const playerPos = playerRef.current.translation();
    camera.position.set(playerPos.x, playerPos.y + 0.6, playerPos.z);
  });

  // ❌ THE SECOND RAYCASTER WAS COMPLETELY REMOVED FROM HERE ❌
  // It is now perfectly and safely handled inside Books.jsx with a guard!

  return (
    <RigidBody
      ref={playerRef}
      position={position}
      type="dynamic"
      enabledRotations={[false, false, false]}
      colliders={false}
    >
      <CapsuleCollider args={[0.4, 0.4]} layers={1} friction={0.5} />
    </RigidBody>
  );
}
