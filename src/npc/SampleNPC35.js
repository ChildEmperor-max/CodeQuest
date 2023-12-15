import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Boy3 from "src/assets/npc/Boy3/Idle.fbx";
import RedTexture from "src/assets/npc/Boy3/Peasant Boy Tom Red.png";

export default class SampleNPC35 extends NPCLoader {
  constructor() {
    super();
    this.path = Boy3;
    this.texture = RedTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 5.5,
    modelPath = this.path,
    npcName = "Zephyrin",
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
