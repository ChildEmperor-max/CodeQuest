import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Maiden2 from "src/assets/npc/Maiden2/Idle.fbx";
import GreenTexture from "src/assets/npc/Maiden2/Peasant Calla Green.png";

export default class SampleNPC20 extends NPCLoader {
  constructor() {
    super();
    this.path = Maiden2;
    this.texture = GreenTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    // rotation = new THREE.Vector3(0, Math.PI, 0),
    rotation = 3,
    modelPath = this.path,
    npcName = "Beatrice",
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
