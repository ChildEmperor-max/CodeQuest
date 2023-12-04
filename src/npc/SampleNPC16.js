import * as THREE from "three";
import NPCLoader from "./NPCLoader";

export default class SampleNPC16 extends NPCLoader {
  constructor() {
    super();
    this.path = "/src/assets/npc/AdultFemale2/";
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 2.5,
    modelPath = this.path,
    npcName = "SampleNPC16: The Comparator's Confluences",
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
