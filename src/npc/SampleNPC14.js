import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Nurse1 from "src/assets/npc/Nurse1/Idle.fbx";
import RedTexture from "src/assets/npc/Nurse1/Peasant Dariah Red.png";

export default class SampleNPC14 extends NPCLoader {
  constructor() {
    super();
    this.path = Nurse1;
    this.texture = RedTexture;
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
    npcName = "Lyanna",
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
