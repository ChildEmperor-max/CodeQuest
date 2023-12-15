import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Maiden3 from "src/assets/npc/Maiden3/Idle.fbx";
import BlueTexture from "src/assets/npc/Maiden3/Peasant Calla Blue.png";

export default class SampleNPC33 extends NPCLoader {
  constructor() {
    super();
    this.path = Maiden3;
    this.texture = BlueTexture;
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
    npcName = "Elinor",
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
