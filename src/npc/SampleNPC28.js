import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Traveler2 from "src/assets/npc/Traveler2/Idle.fbx";
import RedTexture from "src/assets/npc/Traveler2/Peasant Taren Red.png";

export default class SampleNPC28 extends NPCLoader {
  constructor() {
    super();
    this.path = Traveler2;
    this.texture = RedTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 4,
    modelPath = this.path,
    npcName = "Magnus",
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
