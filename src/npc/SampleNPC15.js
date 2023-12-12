import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Nurse2 from "src/assets/npc/Nurse2/Idle.fbx";
import BlueTexture from "src/assets/npc/Nurse2/Peasant Dariah Blue.png";

export default class SampleNPC15 extends NPCLoader {
  constructor() {
    super();
    this.path = Nurse2;
    this.texture = BlueTexture;
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
    npcName = "Seraphina",
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
