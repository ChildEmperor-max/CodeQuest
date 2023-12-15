import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Boy1 from "src/assets/npc/Boy1/Idle.fbx";
import GreenTexture from "src/assets/npc/Boy1/Peasant Boy Tom Green.png";

export default class SampleNPC38 extends NPCLoader {
  constructor() {
    super();
    this.path = Boy1;
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
    npcName = "Lysander",
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
