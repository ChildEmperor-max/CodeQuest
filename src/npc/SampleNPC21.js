import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import ElderMan1 from "src/assets/npc/ElderMan1/Idle.fbx";
import GreyTexture from "src/assets/npc/ElderMan1/Peasant Elder Halden Grey.png";

export default class SampleNPC21 extends NPCLoader {
  constructor() {
    super();
    this.path = ElderMan1;
    this.texture = GreyTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 3,
    modelPath = this.path,
    npcName = "Wise Elder",
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
