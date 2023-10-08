import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import ManageLoader from "../lib/Loader";

// const worldLoader = new GLTFLoader();
let lodLevels = [];
let renderDistance = 100;

export function LoadWorld(loaderElement, textLoaderElement) {
  const loader = new ManageLoader(
    "Loading CodeQuest World ...",
    loaderElement,
    textLoaderElement
  );
  const worldLoader = new GLTFLoader(loader.loadingManager);

  return new Promise((resolve, reject) => {
    worldLoader.load(
      "/src/assets/world/SampleWorld.glb",
      function (gltf) {
        const worldMesh = gltf.scene;
        const worldAnimationsMixer = new THREE.AnimationMixer(worldMesh);
        worldMesh.name = "terrain";
        worldMesh.position.set(3, 0, 3);
        worldMesh.scale.set(1, 1, 1);
        const obstacles = [];
        const walkables = [];
        const transferAreas = [];
        let worldFloor;
        let albyHouseDoorActions = [];
        let doors = [];
        const buildingLOD = new THREE.LOD();

        const spawnPoint = new THREE.Vector3(0, 0, -120);

        const npcSpawnPoint1 = new THREE.Vector3(0, 0, -140);
        const npcSpawnPoint2 = new THREE.Vector3(-8, 0, -135);
        const npcSpawnPoint3 = new THREE.Vector3(3, 0, -135);
        const npcSpawnPoint4 = new THREE.Vector3(3, 0, -145);
        const npcSpawnPoints = [
          npcSpawnPoint1,
          npcSpawnPoint2,
          npcSpawnPoint3,
          npcSpawnPoint4,
        ];

        if (gltf.animations !== undefined) {
          gltf.animations.forEach((clip) => {
            if (clip.name.startsWith("Windmill_blades_rotation")) {
              worldAnimationsMixer.clipAction(clip).play();
            }
            if (clip.name.startsWith("AlbyHouseDoor")) {
              albyHouseDoorActions.push(clip);
            }
          });
        }

        worldMesh.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.name.startsWith("Sphere")) {
              child.frustumCulled = false;
            }
            switch (true) {
              case child.isMesh && child.name.startsWith("Collision_"):
              case child.isMesh && child.name.startsWith("TransferArea_"):
              case child.isMesh && child.name.startsWith("Walkable_"):
              case child.isMesh && child.name.startsWith("Sphere"):
                break; // Skip objects with these prefixes
              default:
                lodLevels.push({ distance: renderDistance, object: child });
                break;
            }
            // if (child.name.startsWith("Inn_Cube393_1")) {
            //   const material = new THREE.MeshStandardMaterial({
            //     color: 0xffffff,
            //     roughness: 0.5,
            //     metalness: 0.5,
            //   });
            //   const geometry2 = new THREE.IcosahedronGeometry(2, 1);
            //   const mesh2 = new THREE.Mesh(geometry2, material);
            //   const mesh3 = new THREE.Mesh(
            //     new THREE.BoxGeometry(3, 3, 3),
            //     new THREE.MeshStandardMaterial({
            //       color: 0x99ffff,
            //     })
            //   );
            //   // buildingLOD.addLevel(mesh2, 50);
            //   // buildingLOD.addLevel(mesh3, 30);

            //   // buildingLOD.addLevel(child, 70);
            //   // child.add(buildingLOD);
            // }
          }

          // if (child.name.startsWith("Floor")) {
          //   child.castShadow = true;
          //   child.receiveShadow = true;
          // }
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
          if (child.name === "House_Door") {
            doors.push(child);
          }
          if (child.name.startsWith("Floor_")) {
            walkables.push(child);
            worldFloor = child;
          }
          if (child.name.startsWith("CityWall")) {
            lodLevels.push({ distance: 1000, object: child });
          }
          // if (child.isMesh && child.name.startsWith("Plane002")) {
          //   if (child.material.name.startsWith("grass")) {
          //     const geometry = child.geometry;
          //     console.log(geometry);
          //   }
          // }
        });

        resolve({
          worldMesh,
          worldFloor,
          walkables,
          obstacles,
          spawnPoint,
          npcSpawnPoints,
          transferAreas,
          worldAnimationsMixer,
          albyHouseDoorActions,
          doors,
          buildingLOD,
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

export function updateLOD(camera) {
  for (let level of lodLevels) {
    if (isCameraNear(camera.position, level)) {
      if (inCameraView(level.object, camera)) {
        level.object.visible = true;
      } else {
        level.object.visible = false;
      }
    } else {
      level.object.visible = false;
      if (level.object.name.startsWith("Plane002")) {
        level.object.visible = true;
      }
      if (level.object.name.startsWith("CityWall")) {
        level.object.visible = true;
      }
    }
  }
}

function inCameraView(object, camera) {
  camera.updateMatrix();
  camera.updateMatrixWorld();
  var frustum = new THREE.Frustum();
  frustum.setFromProjectionMatrix(
    new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    )
  );
  return frustum.containsPoint(object);
}

function isCameraNear(cameraPosition, level) {
  return (
    cameraPosition.distanceTo(
      level.object.getWorldPosition(new THREE.Vector3())
    ) < level.distance
  );
}
