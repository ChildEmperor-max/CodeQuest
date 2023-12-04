import * as THREE from "three";
import NPCLoader from "./NPCLoader";

export default class SampleNPC11 extends NPCLoader {
  constructor() {
    super();
    this.path = "/src/assets/npc/Shop1/";
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
    npcName = "SampleNPC11: Precision in the Market",
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
