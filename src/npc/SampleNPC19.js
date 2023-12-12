import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Maiden1 from "src/assets/npc/Maiden1/Idle.fbx";
import RedTexture from "src/assets/npc/Maiden1/Peasant Calla Red.png";

export default class SampleNPC19 extends NPCLoader {
  constructor() {
    super();
    this.path = Maiden1;
    this.texture = RedTexture;
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
    npcName = "Felicity",
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
