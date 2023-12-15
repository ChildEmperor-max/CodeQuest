import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Nurse4 from "src/assets/npc/Nurse4/Idle.fbx";
import GreenTexture from "src/assets/npc/Nurse4/Peasant Dariah Green.png";

export default class SampleNPC34 extends NPCLoader {
  constructor() {
    super();
    this.path = Nurse4;
    this.texture = GreenTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 2.5,
    modelPath = this.path,
    npcName = "Freesia",
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
