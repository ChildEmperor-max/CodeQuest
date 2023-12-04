import * as THREE from "three";
import NPCLoader from "./NPCLoader";

export default class SampleNPC17 extends NPCLoader {
  constructor() {
    super();
    this.path = "/src/assets/npc/Strawhat1/";
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 3,
    modelPath = this.path,
    npcName = "SampleNPC17: The Logician's Challenge",
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
