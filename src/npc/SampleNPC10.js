import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import ElderMan2 from "src/assets/npc/ElderMan2/Idle.fbx";
import GreenTexture from "src/assets/npc/ElderMan2/Peasant Elder Halden Green.png";

export default class SampleNPC10 extends NPCLoader {
  constructor() {
    super();
    this.path = ElderMan2;
    this.texture = GreenTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 4,
    modelPath = this.path,
    npcName = "Village Scholar",
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
