import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import AdultFemale2 from "src/assets/npc/AdultFemale2/Idle.fbx";
import GreenTexture from "src/assets/npc/AdultFemale2/Peasant Anne Green.png";

export default class SampleNPC16 extends NPCLoader {
  constructor() {
    super();
    this.path = AdultFemale2;
    this.texture = GreenTexture;
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
    npcName = "Amara",
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
