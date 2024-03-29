import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

const loader = new GLTFLoader();

export function LoadSampleWorld() {
  return new Promise((resolve, reject) => {
    loader.load(
      "/src/assets/world/AlbyHouse/AlbyHouseInside.glb",
      function (gltf) {
        const terrainMesh = gltf.scene;
        terrainMesh.name = "terrain";
        terrainMesh.position.set(3, 0, 3);
        terrainMesh.scale.set(1, 1, 1);
        const spawnPoint = new THREE.Vector3(0, 5, 5);
        const obstacles = [];
        const walkables = [];
        const transferAreas = [];
        let worldFloor;

        const npcSpawnPoint1 = new THREE.Vector3(0, 0, -14);
        const npcSpawnPoint2 = new THREE.Vector3(-11, 0, -14);
        const npcSpawnPoints = [npcSpawnPoint1, npcSpawnPoint2];

        // Create a new material and assign it to the mesh
        const material = new THREE.MeshPhongMaterial({ color: 0xf15f0f });
        terrainMesh.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            // child.material = material;
          }
          if (child.isMesh && child.name.startsWith("Walkable_")) {
            child.visible = false;
            walkables.push(child);
          }
          if (child.isMesh) {
            if (child.name.startsWith("TransferArea_")) {
              transferAreas.push(child);
              child.visible = false;
            }
            if (child.name.startsWith("Collision_")) {
              obstacles.push(child);
              child.visible = false;
            }
            if (child.name.startsWith("Floor_")) {
              worldFloor = child;
              walkables.push(worldFloor);
            }
          }
        });

        resolve({
          terrainMesh,
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
