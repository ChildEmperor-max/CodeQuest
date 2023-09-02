import * as THREE from "three";

import Stats from "three/examples/jsm/libs/stats.module";
import SceneLighting from "./SceneLighting";
import CameraController from "./CameraControls";
import { LoadWorld, updateWorldRender } from "../world/LoadWorld";
import { LoadSampleWorld } from "../world/SampleWorld";
import TextManager from "./TextManager";
import QuestManager from "./QuestManager";

import SampleNPC1 from "../npc/SampleNPC1";
import SampleNPC2 from "../npc/SampleNPC2";
import AlbyNPC from "../npc/AlbyNPC";
import keys from "./KeyControls";
import { addGrassShader, updateGrassShader } from "../world/grassShader";

export default class SceneInit {
  constructor(canvasId, renderer) {
    this.fov = 45;
    this.canvasId = canvasId;

    this.scene = undefined;
    this.axesHelper = undefined;
    this.clock = undefined;
    this.stats = undefined;
    this.camera = undefined;
    this.controls = undefined;
    this.renderer = renderer;
    this.textRenderer = undefined;
    this.player = undefined;
    this.cameraControls = undefined;
    this.npcs = [];
    this.questManager = new QuestManager();
    this.questManager.initialize();
  }

  initialize(player) {
    this.mainWorldScene = new THREE.Scene();
    this.albyHouseScene = new THREE.Scene();
    this.scene = this.mainWorldScene;
    this.axesHelper = new THREE.AxesHelper(518);
    this.scene.add(this.axesHelper);
    this.clock = new THREE.Clock();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    // this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.VSMShadowMap;

    this.sceneLighting = new SceneLighting(this.scene, this.renderer);
    this.sceneLighting.initialize();

    this.stats = Stats();
    // document.body.appendChild(this.stats.dom);

    this.obstacles = [];
    this.transferAreas = [];
    this.player = player;
    const renderDistance = 1000;

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      renderDistance
    );
    // Modify the render distance
    // this.camera.near = 1;
    // this.camera.far = 100;
    this.camera.position.set(0, 10, -110);

    this.cameraControls = new CameraController(this.renderer, this.camera);
    this.cameraControls.initialize();

    this.loadMainWorld();
    // this.loadAlbyHouseScene();

    this.textManager = new TextManager(this.scene);
    this.textManager.initialize({
      text: "E",
      camera: this.camera,
    });
    this.updateWindowResize();
    this.isFocused = () =>
      typeof document.hidden !== "undefined" ? !document.hidden : null;

    this.initAnim = true;
    this.runAnim = false;
    this.isPlay = false;
    this.animationId = null;

    this.isLoadingWorld = false;

    this.hasMainWorldNPCLoaded = false;

    const grassBladeCount = 45000;
    const grassBladeHeight = 1.8;
    const grassAreaSize = new THREE.Vector3(45.5, 0, 145);
    const grassBladeAngle = 0.195;
    const grassAreaPosition1 = new THREE.Vector3(-30.9, -1.5, -37.5);
    const grassAreaPosition2 = new THREE.Vector3(38.5, -1.5, -37.5);
    addGrassShader(
      this.scene,
      grassBladeCount,
      grassBladeHeight,
      grassAreaSize,
      grassBladeAngle,
      grassAreaPosition1
    );
    addGrassShader(
      this.scene,
      grassBladeCount,
      grassBladeHeight,
      grassAreaSize,
      grassBladeAngle,
      grassAreaPosition2
    );

    this.albyHouseDoorOpening = true;
    this.testPressed = false;
  }

  startAnimation() {
    if (this.initAnim) {
      this.initAnim = false;
      this.runAnim = true;
    }
    // Start and Pause
    if (this.runAnim) {
      this.runAnim = false;
      this.isPlay = true;
      this.clock.start();
      // this.animate();
      if (this.animationId === null) {
        this.animationId = window.requestAnimationFrame(
          this.animate.bind(this)
        );
      }
    } else {
      this.runAnim = true;
      this.isPlay = false;
    }
  }

  stopAnimation() {
    this.initAnim = true;
    this.runAnim = false;
    this.isPlay = false;
    if (this.animationId !== null) {
      window.cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  animate() {
    if (this.isPlay) {
      const delta = this.clock.getDelta();
      this.stats.update();

      if (this.player) {
        for (let i = 0; i < this.npcs.length; i++) {
          if (this.npcs[i]) {
            this.npcs[i].update(delta);
          }
        }
        if (this.cameraControls) {
          this.cameraControls.update(this.player, delta);
        }
        this.player.update(delta, this.npcs);
        updateGrassShader(this.clock);

        // updateWorldRender(this.player.getPosition());

        this.playerDetectNpc(this.npcs, this.textManager);
        this.playerOnDoor(this.textManager);

        this.player.updateNpcDetection(this.npcs);
      }

      if (this.worldAnimationsMixer) {
        this.worldAnimationsMixer.update(delta);
      }

      this.render();
      this.animationId = window.requestAnimationFrame(this.animate.bind(this));
    } else {
      this.clock.stop();
    }
    // this.composer.render();
  }

  loadMainWorld() {
    this.scene = this.mainWorldScene;
    LoadWorld()
      .then(
        ({
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
        }) => {
          this.mainWorldScene.add(worldMesh);
          this.groundMesh = worldFloor;
          this.obstacles = obstacles;
          const collidables = obstacles;
          this.transferAreas = transferAreas;
          this.worldAnimationsMixer = worldAnimationsMixer;

          this.closeDoorAlbyHouse = this.worldAnimationsMixer.clipAction(
            albyHouseDoorActions[0]
          );
          this.openDoorAlbyHouse = this.worldAnimationsMixer.clipAction(
            albyHouseDoorActions[1]
          );
          this.doors = doors;

          // this.obstacles.forEach((element) => {
          //   let box = new THREE.BoxHelper(element, 0xffff00);
          //   this.scene.add(box);
          // });

          this.player.initialize(
            this.mainWorldScene,
            this.camera,
            spawnPoint,
            obstacles,
            walkables,
            worldFloor,
            transferAreas
          );

          if (!this.hasMainWorldNPCLoaded) {
            this.sampleNPC1 = new SampleNPC1(this.mainWorldScene);
            this.sampleNPC1.initialize(
              npcSpawnPoints[0],
              this.camera,
              this.player,
              this.canvasId,
              this.groundMesh
            );
            this.npcs.push(this.sampleNPC1);

            this.sampleNPC2 = new SampleNPC2(this.mainWorldScene);
            this.sampleNPC2.initialize(
              npcSpawnPoints[1],
              this.camera,
              this.player,
              this.canvasId,
              this.groundMesh
            );
            this.npcs.push(this.sampleNPC2);

            this.albyNPC = new AlbyNPC(this.mainWorldScene);
            this.albyNPC.initialize(
              npcSpawnPoints[2],
              this.camera,
              this.player,
              this.canvasId,
              this.groundMesh
            );
            this.npcs.push(this.albyNPC);
            this.hasMainWorldNPCLoaded = true;
          }

          document.getElementById("interface-container").style.display =
            "block";
          this.cameraControls.addCollidables(collidables, this.groundMesh);
          this.cameraControls.setTrackPosition(this.player.getPosition());
          this.isLoadingWorld = false;
        }
      )
      .catch((error) => {
        console.log("error loading world mesh: ", error);
      });
  }

  loadAlbyHouseScene() {
    this.scene = this.albyHouseScene;
    LoadSampleWorld()
      .then(
        ({
          terrainMesh,
          worldFloor,
          walkables,
          obstacles,
          spawnPoint,
          npcSpawnPoints,
          transferAreas,
        }) => {
          this.albyHouseScene.add(terrainMesh);
          this.obstacles = obstacles;
          this.groundMesh = worldFloor;
          this.walkables = walkables;
          this.transferAreas = transferAreas;

          this.player.initialize(
            this.albyHouseScene,
            this.camera,
            spawnPoint,
            obstacles,
            walkables,
            worldFloor,
            transferAreas
          );
          this.cameraControls.addCollidables(obstacles, worldFloor);
          // this.cameraControls.cameraControl.setPosition(
          //   this.player.getPosition().x,
          //   this.player.getPosition().y + 5,
          //   this.player.getPosition().z + 5
          // );
          // this.cameraControls.setTrackPosition(this.player.getPosition());
          this.isLoadingWorld = false;
        }
      )
      .catch((error) => {
        console.log("error loading terrain mesh: ", error);
      });
  }
  removePlayerFromScene(scene) {
    if (this.player) {
      scene.remove(this.player);
    }
  }

  playerOnDoor(actionHint) {
    if (this.player.onTransferArea) {
      const textPosition = new THREE.Vector3(
        this.player.getPosition().x - 1,
        this.player.getPosition().y + 3,
        this.player.getPosition().z
      );
      actionHint.showText(textPosition);
      // actionHint.showText(this.player.transferArea.position);

      if (keys.e.pressed) {
        if (this.player.transferArea.name === "TransferArea_AlbyHouse") {
          if (!this.testPressed) {
            this.albyHouseDoorOpening = !this.albyHouseDoorOpening;

            if (!this.albyHouseDoorOpening) {
              // Play the open door animation
              this.closeDoorAlbyHouse.stop(); // Stop the close door animation if it's running
              this.openDoorAlbyHouse.reset(); // Reset the animation
              this.openDoorAlbyHouse.clampWhenFinished = true;
              this.openDoorAlbyHouse.setLoop(THREE.LoopOnce);
              this.openDoorAlbyHouse.play();
            } else {
              // Play the close door animation
              this.openDoorAlbyHouse.stop(); // Stop the open door animation if it's running
              this.closeDoorAlbyHouse.reset(); // Reset the animation
              this.closeDoorAlbyHouse.clampWhenFinished = true;
              this.closeDoorAlbyHouse.setLoop(THREE.LoopOnce);
              this.closeDoorAlbyHouse.play();
            }

            this.testPressed = true;
          }
        }
      } else {
        this.testPressed = false;
      }
    } else {
      actionHint.hideText();
    }
  }

  playerDetectNpc(npcs, actionHint) {
    var nearNpcAction = undefined;
    var nearNpcName = undefined;
    var actionHintDistance = 4;
    var npcNameDistance = 40;
    for (let i = 0; i < npcs.length; i++) {
      var npcDistance = npcs[i]
        .getPosition()
        .distanceTo(this.player.getPosition());
      if (npcDistance <= actionHintDistance) {
        nearNpcAction = npcs[i];
      }
      if (npcDistance <= npcNameDistance) {
        nearNpcName = npcs[i].npcName;
      }
    }
    if (nearNpcAction) {
      if (nearNpcAction.isTalking) {
        actionHint.hideText();
      } else {
        actionHint.showText(nearNpcAction.getPosition());
      }
    } else {
      actionHint.hideText();
    }
  }

  render() {
    this.uniforms.u_time.value += this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);
  }

  updateWindowResize() {
    window.addEventListener("resize", () => this.onWindowResize(), false);
    this.uniforms = {
      u_time: { type: "f", value: 1.0 },
      colorB: { type: "vec3", value: new THREE.Color(0xfff000) },
      colorA: { type: "vec3", value: new THREE.Color(0xffffff) },
    };
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
