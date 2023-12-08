import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import AdultFemale1 from "src/assets/npc/AdultFemale1/Idle.fbx";
import RedTexture from "src/assets/npc/AdultFemale1/Peasant Anne Red.png";

export default class SampleNPC2 extends NPCLoader {
  constructor() {
    super();
    this.path = AdultFemale1;
    this.texture = RedTexture;
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
    npcName = "SampleNPC2",
    scale = 0.01,
    destination = new THREE.Vector3(-8, 0, -120),
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
