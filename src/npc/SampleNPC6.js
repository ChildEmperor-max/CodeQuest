import * as THREE from "three";
import NPCLoader from "./NPCLoader";

export default class SampleNPC6 extends NPCLoader {
  constructor() {
    super();
    this.path = "/src/assets/npc/teenFemale1/";
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 1,
    modelPath = this.path,
    npcName = "Elara",
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
