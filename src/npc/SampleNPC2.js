import * as THREE from "three";
import NPCLoader from "./NPCLoader";

export default class SampleNPC2 extends NPCLoader {
  constructor() {
    super();
    this.path = "/src/assets/npc/AdultFemale1/";
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = new THREE.Vector3(200, 0, 0),
    modelPath = this.path,
    npcName = "SampleNPC2",
    scale = 0.01,
    destination = new THREE.Vector3(-8, 0, -120)
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
      scale,
      destination
    );
  }
}
