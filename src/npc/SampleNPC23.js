import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Boy2 from "src/assets/npc/Boy2/Idle.fbx";
import GreenTexture from "src/assets/npc/Boy2/Peasant Boy Tom Green.png";

export default class SampleNPC23 extends NPCLoader {
  constructor() {
    super();
    this.path = Boy2;
    this.texture = GreenTexture;
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
    npcName = "Gideon",
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
