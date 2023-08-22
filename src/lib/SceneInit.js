import * as THREE from "three";

import Stats from "three/examples/jsm/libs/stats.module";
import Player from "../player/Player";
import SceneLighting from "./SceneLighting";
import CameraController from "./CameraControls";
import { LoadWorld, updateWorldRender } from "../world/LoadWorld";
import { LoadSampleWorld } from "../world/SampleWorld";
import TextManager from "./TextManager";
import QuestManager from "./QuestManager";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import SampleNPC1 from "../npc/SampleNPC1";
import SampleNPC2 from "../npc/SampleNPC2";
import AlbyNPC from "../npc/AlbyNPC";
import keys from "./KeyControls";

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

  initialize() {
    this.mainWorldScene = new THREE.Scene();
    this.albyHouseScene = new THREE.Scene();
    this.scene = this.mainWorldScene;
    this.axesHelper = new THREE.AxesHelper(8);
    // this.scene.add(this.axesHelper);
    this.clock = new THREE.Clock();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    // this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.VSMShadowMap;

    const sceneLighting = new SceneLighting(this.scene, this.renderer);
    sceneLighting.initialize();

    this.stats = Stats();
    // document.body.appendChild(this.stats.dom);

    this.obstacles = [];
    this.transferAreas = [];
    this.player = new Player();
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

    const renderPass = new RenderPass(this.scene, this.camera);

    // Create the bloom pass for the glow effect
    // Create the bloom pass for the glow effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1,
      0,
      0
    );
    bloomPass.threshold = 0.2; // Adjust the threshold for the glow effect
    bloomPass.strength = 0.2; // Reduce the strength of the glow effect
    bloomPass.radius = 0.5; // Reduce the radius of the glow effect
    // this.renderer.physicallyCorrectLights = true; // This will be required for matching the glTF spec.

    // Create the effect composer and add the passes
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(bloomPass);
    this.isLoadingWorld = false;

    this.hasMainWorldNPCLoaded = false;
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
        // updateWorldRender(this.player.getPosition());

        this.playerDetectNpc(this.npcs, this.textManager);
        this.playerOnTransferArea(this.textManager);

        this.player.updateNpcDetection(this.npcs);
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
        }) => {
          this.mainWorldScene.add(worldMesh);
          this.groundMesh = worldFloor;
          this.obstacles = obstacles;
          const collidables = obstacles;
          this.transferAreas = transferAreas;

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

  playerOnTransferArea(actionHint) {
    if (this.player.onTransferArea) {
      actionHint.showText(this.player.transferArea.position);

      if (keys.e.pressed) {
        if (!this.isLoadingWorld) {
          if (this.player.transferArea.name === "TransferArea_AlbyHouse") {
            this.scene = this.albyHouseScene;
            this.removePlayerFromScene(this.mainWorldScene);
            this.loadAlbyHouseScene();

            const sceneLighting = new SceneLighting(this.scene, this.renderer);
            sceneLighting.initialize();
            this.isLoadingWorld = true;
            this.player.onTransferArea = false;
          }
          if (this.player.transferArea.name === "TransferArea_MainWorld") {
            this.scene = this.mainWorldScene;
            this.removePlayerFromScene(this.albyHouseScene);
            this.loadMainWorld();
            this.isLoadingWorld = true;
            this.cameraControls.setTrackPosition(this.player.getPosition());
            this.player.onTransferArea = false;
          }
        }
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
