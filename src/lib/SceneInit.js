import * as THREE from "three";

import Stats from "three/examples/jsm/libs/stats.module";
import Player from "../player/Player";
import SceneLighting from "./SceneLighting";
import CameraControls from "./CameraControls";
import { LoadWorld } from "../world/LoadWorld";
// import { LoadWorld } from "../world/SampleWorld";
import TextManager from "./TextManager";
import QuestManager from "./QuestManager";

import SampleNPC1 from "../npc/SampleNPC1";
import SampleNPC2 from "../npc/SampleNPC2";
import AlbyNPC from "../npc/AlbyNPC";

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
    this.npcs = [];
    this.questManager = new QuestManager();
    this.questManager.initialize();
  }

  initialize() {
    this.scene = new THREE.Scene();

    this.axesHelper = new THREE.AxesHelper(8);
    this.scene.add(this.axesHelper);
    this.clock = new THREE.Clock();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    // this.renderer.shadowMap.enabled = true;
    // this.renderer.shadowMap.type = THREE.VSMShadowMap;

    const sceneLighting = new SceneLighting(this.scene, this.renderer);
    sceneLighting.initialize();

    this.stats = Stats();
    // document.body.appendChild(this.stats.dom);

    const cameraControls = new CameraControls(this.renderer);
    cameraControls.initialize();
    this.cameraControls = cameraControls;

    this.obstacles = [];
    this.player = new Player();
    LoadWorld()
      .then(({ terrainMesh, obstacles, spawnPoint, npcSpawnPoints }) => {
        this.scene.add(terrainMesh);
        this.groundMesh = terrainMesh;
        this.obstacles = obstacles;
        this.player.initialize(
          this.scene,
          this.cameraControls.camera,
          spawnPoint,
          obstacles,
          this.groundMesh
        );

        this.sampleNPC1 = new SampleNPC1(this.scene);
        this.sampleNPC1.initialize(
          npcSpawnPoints[0],
          this.cameraControls.camera,
          this.player,
          this.canvasId
        );
        this.npcs.push(this.sampleNPC1);

        this.sampleNPC2 = new SampleNPC2(this.scene);
        this.sampleNPC2.initialize(
          npcSpawnPoints[1],
          this.cameraControls.camera,
          this.player,
          this.canvasId
        );
        this.npcs.push(this.sampleNPC2);

        this.albyNPC = new AlbyNPC(this.scene);
        this.albyNPC.initialize(
          npcSpawnPoints[2],
          this.cameraControls.camera,
          this.player,
          this.canvasId
        );
        this.npcs.push(this.albyNPC);

        document.getElementById("interface-container").style.display = "block";
      })
      .catch((error) => {
        console.log("error loading terrain mesh: ", error);
      });

    this.textManager = new TextManager(this.scene);
    this.textManager.initialize({
      text: "E",
      camera: this.cameraControls.camera,
    });
    this.updateWindowResize();
    this.isFocused = () =>
      typeof document.hidden !== "undefined" ? !document.hidden : null;

    this.initAnim = true;
    this.runAnim = false;
    this.isPlay = false;
    this.animationId = null;
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
        this.cameraControls.update(this.player.getPosition());
        this.player.update(delta, this.npcs);

        this.playerDetectNpc(this.npcs, this.textManager);

        this.player.updateNpcDetection(this.npcs);
      }

      this.render();
      this.animationId = window.requestAnimationFrame(this.animate.bind(this));
    } else {
      console.log("stopped");
      this.clock.stop();
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
      actionHint.showText(nearNpcAction.getPosition());
      if (nearNpcAction.isTalking) {
        actionHint.hideText();
      }
    } else {
      actionHint.hideText();
    }
    // if (nearNpcName) {
    //   console.log(nearNpcName);
    // }
  }

  render() {
    this.uniforms.u_time.value += this.clock.getDelta();
    this.renderer.render(this.scene, this.cameraControls.camera);
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
    this.cameraControls.camera.aspect = window.innerWidth / window.innerHeight;
    this.cameraControls.camera.updateProjectionMatrix();
    this.cameraControls.camera.updateMatrixWorld();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
