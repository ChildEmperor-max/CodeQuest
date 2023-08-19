import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const loader = new GLTFLoader();
const visibilityThreshold = 100;
let objectsToRender = [];

export function LoadWorld() {
  return new Promise((resolve, reject) => {
    loader.load(
      "/src/assets/world/codequest_map.glb",
      function (gltf) {
        const worldMesh = gltf.scene;
        worldMesh.name = "terrain";
        worldMesh.position.set(3, 0, 3);
        worldMesh.scale.set(1, 1, 1);
        const obstacles = [];
        const walkables = [];
        const transferAreas = [];
        let worldFloor;

        const spawnPoint = new THREE.Vector3(0, 0, -120);

        const npcSpawnPoint1 = new THREE.Vector3(0, 10, -140);
        const npcSpawnPoint2 = new THREE.Vector3(-8, 0, -135);
        const npcSpawnPoint3 = new THREE.Vector3(3, 0, -135);
        const npcSpawnPoint4 = new THREE.Vector3(3, 0, -145);
        const npcSpawnPoints = [
          npcSpawnPoint1,
          npcSpawnPoint2,
          npcSpawnPoint3,
          npcSpawnPoint4,
        ];

        worldMesh.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.name.startsWith("Sphere")) {
              child.frustumCulled = false;
            }
          }
          if (child.isMesh && child.name.startsWith("Walkable_")) {
            child.visible = false;
            walkables.push(child);
          }
          if (child.isMesh && child.name.startsWith("TransferArea_")) {
            transferAreas.push(child);
            child.visible = false;
          }
          if (child.isMesh && child.name.startsWith("Collision_")) {
            obstacles.push(child);
            child.visible = false;

            // Create a collision box for the obstacle
            // const obstacleCollisionBox = new THREE.Box3().setFromObject(child);
            // child.obstacleCollisionBox = obstacleCollisionBox;
          }
          if (child.name.startsWith("Plane_")) {
            worldFloor = child;
            walkables.push(worldFloor);
          }
        });

        resolve({
          worldMesh,
          worldFloor,
          walkables,
          obstacles,
          spawnPoint,
          npcSpawnPoints,
          transferAreas,
        });
      },
      undefined,
      function (error) {
        console.error(error);
        reject(error);
      }
    );
  });
}

export function updateWorldRender(playerPosition) {
  for (var object of objectsToRender) {
    // Calculate the distance between the player and the object
    const objectPosition = object.position; // Replace with your object's position
    const distanceToPlayer = playerPosition.distanceTo(objectPosition);

    // Check if the distance is within the visibility threshold
    if (distanceToPlayer <= visibilityThreshold) {
      object.visible = true; // Make the object visible
    } else {
      object.visible = false; // Hide the object
    }
  }
}
