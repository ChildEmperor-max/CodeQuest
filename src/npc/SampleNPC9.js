import * as THREE from "three";
import NPCLoader from "./NPCLoader";

export default class SampleNPC9 extends NPCLoader {
  constructor() {
    super();
    this.path = "/src/assets/npc/ElderWoman1/";
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 4.5,
    modelPath = this.path,
    npcName = "Village Historian",
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
