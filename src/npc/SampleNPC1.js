import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import OldMan1 from "/src/assets/npc/OldMan1/Idle.fbx";

export default class SampleNPC1 extends NPCLoader {
  constructor() {
    super();
    this.path = OldMan1;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 0, // 0 to 5
    modelPath = this.path,
    npcName = "SampleNPC1",
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
