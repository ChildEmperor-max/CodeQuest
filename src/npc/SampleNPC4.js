import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Traveler1 from "/src/assets/npc/Traveler1/Idle.fbx";
import BlueTexture from "src/assets/npc/Traveler1/Peasant Taren Blue.png";

export default class SampleNPC4 extends NPCLoader {
  constructor() {
    super();
    this.path = Traveler1;
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
