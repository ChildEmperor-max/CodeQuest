import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Shop1 from "src/assets/npc/Shop1/Idle.fbx";
import BrownTexture from "src/assets/npc/Shop1/Peasant Taren Brown.png";

export default class SampleNPC11 extends NPCLoader {
  constructor() {
    super();
    this.path = Shop1;
    this.texture = BrownTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 3.5,
    modelPath = this.path,
    npcName = "Market Merchant",
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
