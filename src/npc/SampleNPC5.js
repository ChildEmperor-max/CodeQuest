import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import worker2 from "src/assets/npc/worker2/Idle.fbx";
import KhakiTexture from "src/assets/npc/worker2/Peasant Bryon Khaki.png";

export default class SampleNPC5 extends NPCLoader {
  constructor() {
    super();
    this.path = worker2;
    this.texture = KhakiTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 2.5,
    modelPath = this.path,
    npcName = "Kael the Aspiring Blacksmith",
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
