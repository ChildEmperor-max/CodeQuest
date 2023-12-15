import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Nurse3 from "src/assets/npc/Nurse3/Idle.fbx";
import PurpleTexture from "src/assets/npc/Nurse3/Peasant Dariah Purple.png";

export default class SampleNPC15 extends NPCLoader {
  constructor() {
    super();
    this.path = Nurse3;
    this.texture = PurpleTexture;
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
    npcName = "Ismeria",
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
