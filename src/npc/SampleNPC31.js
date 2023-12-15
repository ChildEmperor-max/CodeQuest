import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import ElderMan5 from "src/assets/npc/ElderMan5/Idle.fbx";
import GreenTexture from "src/assets/npc/ElderMan5/Peasant Elder Halden Green.png";

export default class SampleNPC31 extends NPCLoader {
  constructor() {
    super();
    this.path = ElderMan5;
    this.texture = GreenTexture;
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
    npcName = "Godfrey",
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
