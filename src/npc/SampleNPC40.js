import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Nurse2 from "src/assets/npc/Nurse2/Idle.fbx";
import PurpleTexture from "src/assets/npc/Nurse2/Peasant Dariah Purple.png";

export default class SampleNPC40 extends NPCLoader {
  constructor() {
    super();
    this.path = Nurse2;
    this.texture = PurpleTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 2,
    modelPath = this.path,
    npcName = "Thyra",
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
