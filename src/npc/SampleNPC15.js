import * as THREE from "three";
import NPCLoader from "./NPCLoader";

export default class SampleNPC15 extends NPCLoader {
  constructor() {
    super();
    this.path = "/src/assets/npc/Nurse2/";
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 3.5,
    modelPath = this.path,
    npcName = "Seraphina",
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
