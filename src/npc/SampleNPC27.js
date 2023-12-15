import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Strawhat2 from "src/assets/npc/Strawhat2/Idle.fbx";
import BrownTexture from "src/assets/npc/Strawhat2/Peasant Nolant Brown.png";

export default class SampleNPC27 extends NPCLoader {
  constructor() {
    super();
    this.path = Strawhat2;
    this.texture = BrownTexture;
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
    npcName = "Alaric",
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
