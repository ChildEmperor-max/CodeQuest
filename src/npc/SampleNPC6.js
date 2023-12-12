import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import teenFemale1 from "src/assets/npc/teenFemale1/Idle.fbx";
import GreenTexture from "src/assets/npc/teenFemale1/Peasant Kaida Green.png";

export default class SampleNPC6 extends NPCLoader {
  constructor() {
    super();
    this.path = teenFemale1;
    this.texture = GreenTexture;
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
    scale = 0.01,
    destination = null,
    modelTexturePath = this.texture
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
      destination,
      modelTexturePath
    );
  }
}
