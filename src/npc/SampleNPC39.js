import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Strawhat1 from "src/assets/npc/Strawhat1/Idle.fbx";
import GreenTexture from "src/assets/npc/Strawhat1/Peasant Nolant Green.png";

export default class SampleNPC39 extends NPCLoader {
  constructor() {
    super();
    this.path = Strawhat1;
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
    npcName = "Hæstan",
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
