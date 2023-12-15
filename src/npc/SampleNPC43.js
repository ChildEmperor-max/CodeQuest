import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Shop1 from "src/assets/npc/Shop1/Idle.fbx";
import RedTexture from "src/assets/npc/Shop1/Peasant Taren Red.png";

export default class SampleNPC43 extends NPCLoader {
  constructor() {
    super();
    this.path = Shop1;
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
    npcName = "Wolfram",
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
