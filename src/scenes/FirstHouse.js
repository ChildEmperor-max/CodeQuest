import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export default class FirstHouseInterior {
  constructor() {
    this.scene = new THREE.Scene();
    this.axesHelper = new THREE.AxesHelper(8);
    this.scene.add(this.axesHelper);
    this.loader = new GLTFLoader();
  }

  loadRoom() {
    return new Promise((resolve, reject) => {
      this.loader.load(
        "src/assets/world/FirstHouseInterior/FirstHouseInterior.glb",
        function (gltf) {
          const mesh = gltf.scene;
          mesh.name = "FirstHouseInterior";
          mesh.position.set(3, 0, 3);
          mesh.scale.set(1, 1, 1);
          const obstacles = [];
          const spawnPoint = new THREE.Vector3(0, 0, 0);

          const npcSpawnPoint1 = new THREE.Vector3(0, 0, -14);
          const npcSpawnPoint2 = new THREE.Vector3(-8, 0, -13);
          const npcSpawnPoint3 = new THREE.Vector3(3, 0, -13);
          const npcSpawnPoint4 = new THREE.Vector3(3, 0, -14);
          const npcSpawnPoints = [
            npcSpawnPoint1,
            npcSpawnPoint2,
            npcSpawnPoint3,
            npcSpawnPoint4,
          ];

          mesh.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              // child.receiveShadow = true;
              if (child.name === "Plane") {
                child.receiveShadow = true;
              }
            }
            if (child.isMesh && child.name.startsWith("Walkable_")) {
              child.visible = false;
            }
            if (child.isMesh && child.name.startsWith("Collision_")) {
              obstacles.push(child);
              child.visible = false;
            }
          });

          resolve({ mesh, obstacles, spawnPoint, npcSpawnPoints });
        },
        undefined,
        function (error) {
          console.error(error);
          reject(error);
        }
      );
    });
  }
}
