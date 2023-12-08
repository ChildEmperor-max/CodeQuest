import * as THREE from "three";
import NPCLoader from "./NPCLoader";

export default class SampleNPC25 extends NPCLoader {
  constructor() {
    super();
    this.path = "/src/assets/npc/ElderMan4/";
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 5.5,
    modelPath = this.path,
    npcName = "Guardian of Secrets",
    scale = 0.01
  ) {
    super.initialize(
      scene,
      position,
      camera,
      player,
      canvas,
      groundMesh,
      rotation,
      modelPath,
      npcName,
      scale
    );
  }
}