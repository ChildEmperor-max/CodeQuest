import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import ElderWoman3 from "src/assets/npc/ElderWoman3/Idle.fbx";
import OrangeTexture from "src/assets/npc/ElderWoman3/Peasant Elder Grenda Orange.png";

export default class SampleNPC30 extends NPCLoader {
  constructor() {
    super();
    this.path = ElderWoman3;
    this.texture = OrangeTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 1,
    modelPath = this.path,
    npcName = "Pernelle",
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
