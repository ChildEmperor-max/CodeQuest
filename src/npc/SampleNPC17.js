import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Strawhat1 from "src/assets/npc/Strawhat1/Idle.fbx";
import YellowTexture from "src/assets/npc/Strawhat1/Peasant Nolant Yellow.png";

export default class SampleNPC17 extends NPCLoader {
  constructor() {
    super();
    this.path = Strawhat1;
    this.texture = YellowTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 3,
    modelPath = this.path,
    npcName = "SampleNPC17: The Logician's Challenge",
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
