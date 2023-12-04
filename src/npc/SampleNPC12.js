import * as THREE from "three";
import NPCLoader from "./NPCLoader";

export default class SampleNPC12 extends NPCLoader {
  constructor() {
    super();
    this.path = "/src/assets/npc/Girl1/";
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 1.5,
    modelPath = this.path,
    npcName = "SampleNPC12: The Widening Horizon",
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
