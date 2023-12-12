import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Girl1 from "src/assets/npc/Girl1/Idle.fbx";
import YellowTexture from "src/assets/npc/Girl1/Peasant Girl Elsie Yellow.png";

export default class SampleNPC12 extends NPCLoader {
  constructor() {
    super();
    this.path = Girl1;
    this.texture = YellowTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 1.5,
    modelPath = this.path,
    npcName = "Elysia Stormborn",
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
