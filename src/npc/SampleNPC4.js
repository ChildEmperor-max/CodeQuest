import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import OldMan1 from "src/assets/npc/OldMan1/Idle.fbx";
import BrownTexture from "src/assets/npc/OldMan1/Peasant Orin Brown.png";

export default class SampleNPC4 extends NPCLoader {
  constructor() {
    super();
    this.path = OldMan1;
    this.texture = BrownTexture;
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
    npcName = "Village Explorer",
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
