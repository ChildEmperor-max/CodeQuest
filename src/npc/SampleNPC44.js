import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import teenFemale1 from "src/assets/npc/teenFemale1/Idle.fbx";
import RedTexture from "src/assets/npc/teenFemale1/Peasant Kaida Red.png";

export default class SampleNPC44 extends NPCLoader {
  constructor() {
    super();
    this.path = teenFemale1;
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
    npcName = "Rhiannon",
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
