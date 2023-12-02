import * as THREE from "three";
import NPCLoader from "./NPCLoader";

export default class SampleNPC20 extends NPCLoader {
  constructor() {
    super();
    this.path = "/src/assets/npc/OldMan1/";
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = new THREE.Vector3(0, 0, 0),
    modelPath = this.path,
    npcName = "SampleNPC20: Whispers of the Silent Code",
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
