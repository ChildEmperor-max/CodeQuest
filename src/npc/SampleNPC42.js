import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import AdultFemale2 from "src/assets/npc/AdultFemale2/Idle.fbx";
import YellowTexture from "src/assets/npc/AdultFemale2/Peasant Anne Yellow.png";

export default class SampleNPC42 extends NPCLoader {
  constructor() {
    super();
    this.path = AdultFemale2;
    this.texture = YellowTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 5,
    modelPath = this.path,
    npcName = "Guinevere",
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
