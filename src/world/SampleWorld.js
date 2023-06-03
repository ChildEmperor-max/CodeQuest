import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const loader = new GLTFLoader();

export function LoadWorld() {
  return new Promise((resolve, reject) => {
    loader.load(
      "/src/assets/world/SampleWorld.glb",
      function (gltf) {
        const terrainMesh = gltf.scene;
        terrainMesh.name = "terrain";
        terrainMesh.position.set(3, 0, 3);
        terrainMesh.scale.set(3, 3, 3);
        const obstacles = [];
        const spawnPoint = new THREE.Vector3(-12, 0, 0);

        const npcSpawnPoint1 = new THREE.Vector3(0, 0, -14);
        const npcSpawnPoint2 = new THREE.Vector3(-11, 0, -14);
        const npcSpawnPoints = [npcSpawnPoint1, npcSpawnPoint2];

        // Create a new material and assign it to the mesh
        const material = new THREE.MeshPhongMaterial({ color: 0xf15f0f });
        terrainMesh.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = material;
          }
          if (child.isMesh) {
            if (child.name.startsWith("obstacle_")) {
              obstacles.push(child);
              // Create a collision box for the obstacle
              const obstacleCollisionBox = new THREE.Box3().setFromObject(
                child
              );
              child.obstacleCollisionBox = obstacleCollisionBox;
            }
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
