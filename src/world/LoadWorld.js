import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const loader = new GLTFLoader();

export function LoadWorld() {
  return new Promise((resolve, reject) => {
    loader.load(
      "/src/assets/world/codequest_map.glb",
      function (gltf) {
        const terrainMesh = gltf.scene;
        terrainMesh.name = "terrain";
        terrainMesh.position.set(3, 0, 3);
        terrainMesh.scale.set(1, 1, 1);
        const obstacles = [];
        const spawnPoint = new THREE.Vector3(0, 100, -120);

        const npcSpawnPoint1 = new THREE.Vector3(0, 0, -140);
        const npcSpawnPoint2 = new THREE.Vector3(-11, 0, -140);
        const npcSpawnPoints = [npcSpawnPoint1, npcSpawnPoint2];

        terrainMesh.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
          if (child.isMesh && child.name.startsWith("Walkable_")) {
            child.visible = false;
          }
          if (child.isMesh && child.name.startsWith("Collision_")) {
            obstacles.push(child);
            // child.visible = false;

            // Create a collision box for the obstacle
            // const obstacleCollisionBox = new THREE.Box3().setFromObject(child);
            // child.obstacleCollisionBox = obstacleCollisionBox;
          }
        });

        resolve({ terrainMesh, obstacles, spawnPoint, npcSpawnPoints });
      },
      undefined,
      function (error) {
        console.error(error);
        reject(error);
      }
    );
  });
}
