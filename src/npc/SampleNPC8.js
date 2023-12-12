import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import ElderMan3 from "src/assets/npc/ElderMan3/Idle.fbx";
import KhakiTexture from "src/assets/npc/ElderMan3/Peasant Elder Halden Khaki.png";

export default class SampleNPC8 extends NPCLoader {
  constructor() {
    super();
    this.path = ElderMan3;
    this.texture = KhakiTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 4.5,
    modelPath = this.path,
    npcName = "Lord Reynard Blackthorn",
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
