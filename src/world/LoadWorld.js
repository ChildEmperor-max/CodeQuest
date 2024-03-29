import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import ManageLoader from "../lib/Loader";
// import CodeQuestMap from "src/assets/world/SampleWorld.glb";
import CodeQuestMap from "src/assets/world/codequest_map.glb";

// const worldLoader = new GLTFLoader();
let lodLevels = [];
let renderDistance = 500;

export function LoadWorld(loaderElement, textLoaderElement) {
  const loader = new ManageLoader(
    "Loading CodeQuest World ...",
    loaderElement,
    textLoaderElement
  );
  const worldLoader = new GLTFLoader(loader.loadingManager);

  return new Promise((resolve, reject) => {
    worldLoader.load(
      CodeQuestMap,
      // "/src/assets/world/SamplWorld.glb",
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
        // const spawnPoint = new THREE.Vector3(150, 0, -2);

        const npcSpawnPoint1 = new THREE.Vector3(-70, 0, -150);
        const npcSpawnPoint2 = new THREE.Vector3(-8, 0, -135);
        const npcSpawnPoint3 = new THREE.Vector3(3, 0, -135);
        const npcSpawnPoint4 = new THREE.Vector3(-21, 0, -248);
        const npcSpawnPoint5 = new THREE.Vector3(50, 0, -215); //2.5, 0, -36
        const npcSpawnPoint6 = new THREE.Vector3(170, 0, -56);
        const npcSpawnPoint7 = new THREE.Vector3(120, 0, 150); //61, 0, -50
        const npcSpawnPoint8 = new THREE.Vector3(-200, 0, -100);
        const npcSpawnPoint9 = new THREE.Vector3(-175, 0, 51);
        const npcSpawnPoint10 = new THREE.Vector3(223, 0, 59);
        const npcSpawnPoint11 = new THREE.Vector3(55, 0, 83);
        const npcSpawnPoint12 = new THREE.Vector3(259, 0, -22);
        const npcSpawnPoint13 = new THREE.Vector3(-75, 0, -15);
        const npcSpawnPoint14 = new THREE.Vector3(-104, 0, -195);
        const npcSpawnPoint15 = new THREE.Vector3(218, 0, -97);
        const npcSpawnPoint16 = new THREE.Vector3(-145, 0, -78);
        const npcSpawnPoint17 = new THREE.Vector3(-60, 0, 65);
        const npcSpawnPoint18 = new THREE.Vector3(44, 0, -162);
        const npcSpawnPoint19 = new THREE.Vector3(178, 0, 51);
        const npcSpawnPoint20 = new THREE.Vector3(-220, 0, -18);
        const npcSpawnPoint21 = new THREE.Vector3(-220, 0, -15);
        const npcSpawnPoint22 = new THREE.Vector3(-80, 0, 240);
        const npcSpawnPoint23 = new THREE.Vector3(3, 0, 232);
        const npcSpawnPoint24 = new THREE.Vector3(-222.5, 0, 114);
        const npcSpawnPoint25 = new THREE.Vector3(-223, 0, 111);
        const npcSpawnPoint26 = new THREE.Vector3(157, 0, -149);
        const npcSpawnPoint27 = new THREE.Vector3(120, 0, 237);
        const npcSpawnPoint28 = new THREE.Vector3(223, 0, 100);
        const npcSpawnPoint29 = new THREE.Vector3(220, 0, 128);
        const npcSpawnPoint30 = new THREE.Vector3(190, 0, 175);
        const npcSpawnPoint31 = new THREE.Vector3(150, 0, 110);
        const npcSpawnPoint32 = new THREE.Vector3(149, 0, 112);
        const npcSpawnPoint33 = new THREE.Vector3(-18, 0, -213);
        const npcSpawnPoint34 = new THREE.Vector3(22, 0, -213);
        const npcSpawnPoint35 = new THREE.Vector3(74, 0, -152);
        const npcSpawnPoint36 = new THREE.Vector3(114, 0, -192);
        const npcSpawnPoint37 = new THREE.Vector3(98, 0, -123);
        const npcSpawnPoint38 = new THREE.Vector3(125, 0, -97);
        const npcSpawnPoint39 = new THREE.Vector3(-145, 0, -160);
        const npcSpawnPoint40 = new THREE.Vector3(-115, 0, -112);
        const npcSpawnPoint41 = new THREE.Vector3(-155, 0, 190);
        const npcSpawnPoint42 = new THREE.Vector3(-180, 0, 160);
        const npcSpawnPoint43 = new THREE.Vector3(-125, 0, 150);
        const npcSpawnPoint44 = new THREE.Vector3(-150, 0, -2);
        const npcSpawnPoint45 = new THREE.Vector3(150, 0, -2);

        const npcSpawnPoints = [
          npcSpawnPoint1,
          npcSpawnPoint2,
          npcSpawnPoint3,
          npcSpawnPoint4,
          npcSpawnPoint5,
          npcSpawnPoint6,
          npcSpawnPoint7,
          npcSpawnPoint8,
          npcSpawnPoint9,
          npcSpawnPoint10,
          npcSpawnPoint11,
          npcSpawnPoint12,
          npcSpawnPoint13,
          npcSpawnPoint14,
          npcSpawnPoint15,
          npcSpawnPoint16,
          npcSpawnPoint17,
          npcSpawnPoint18,
          npcSpawnPoint19,
          npcSpawnPoint20,
          npcSpawnPoint21,
          npcSpawnPoint22,
          npcSpawnPoint23,
          npcSpawnPoint24,
          npcSpawnPoint25,
          npcSpawnPoint26,
          npcSpawnPoint27,
          npcSpawnPoint28,
          npcSpawnPoint29,
          npcSpawnPoint30,
          npcSpawnPoint31,
          npcSpawnPoint32,
          npcSpawnPoint33,
          npcSpawnPoint34,
          npcSpawnPoint35,
          npcSpawnPoint36,
          npcSpawnPoint37,
          npcSpawnPoint38,
          npcSpawnPoint39,
          npcSpawnPoint40,
          npcSpawnPoint41,
          npcSpawnPoint42,
          npcSpawnPoint43,
          npcSpawnPoint44,
          npcSpawnPoint45,
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
