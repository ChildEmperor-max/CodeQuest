import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Girl3 from "src/assets/npc/Girl3/Idle.fbx";
import PurpleTexture from "src/assets/npc/Girl3/Peasant Girl Elsie Purple.png";

export default class SampleNPC32 extends NPCLoader {
  constructor() {
    super();
    this.path = Girl3;
    this.texture = PurpleTexture;
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
    npcName = "Ninette",
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
