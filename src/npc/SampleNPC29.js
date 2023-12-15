import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Boy3 from "src/assets/npc/Boy3/Idle.fbx";
import BlueTexture from "src/assets/npc/Boy3/Peasant Boy Tom Blue.png";

export default class SampleNPC29 extends NPCLoader {
  constructor() {
    super();
    this.path = Boy3;
    this.texture = BlueTexture;
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
