import * as THREE from "three";
import NPCLoader from "./NPCLoader";

export default class SampleNPC19 extends NPCLoader {
  constructor() {
    super();
    this.path = "/src/assets/npc/Maiden1/";
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 0,
    modelPath = this.path,
    npcName = "SampleNPC19: The Symphony of Transformation",
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
