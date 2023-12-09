import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import AlbyModel from "src/assets/models/alby/Idle.fbx";
import LaptopTexture from "src/assets/models/alby/laptop-test-texture.png";

export default class AlbyNPC extends NPCLoader {
  constructor() {
    super();
    this.path = AlbyModel;
    this.texture = LaptopTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = new THREE.Vector3(0, 0, 0),
    modelPath = this.path,
    npcName = "Alby",
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
