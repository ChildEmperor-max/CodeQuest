import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Girl2 from "src/assets/npc/Girl2/Idle.fbx";
import RedTexture from "src/assets/npc/Girl2/Peasant Girl Elsie Red.png";

export default class SampleNPC24 extends NPCLoader {
  constructor() {
    super();
    this.path = Girl2;
    this.texture = RedTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 5,
    modelPath = this.path,
    npcName = "Aria",
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
