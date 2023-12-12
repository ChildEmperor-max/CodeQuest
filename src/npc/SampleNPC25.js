import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import ElderMan4 from "src/assets/npc/ElderMan4/Idle.fbx";
import BrownTexture from "src/assets/npc/ElderMan4/Peasant Elder Halden Brown.png";

export default class SampleNPC25 extends NPCLoader {
  constructor() {
    super();
    this.path = ElderMan4;
    this.texture = BrownTexture;
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
    npcName = "Guardian of Secrets",
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
