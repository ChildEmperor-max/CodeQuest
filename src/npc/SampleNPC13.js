import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import ElderWoman2 from "src/assets/npc/ElderWoman2/Idle.fbx";
import OrangeTexture from "src/assets/npc/ElderWoman2/Peasant Elder Grenda Orange.png";

export default class SampleNPC13 extends NPCLoader {
  constructor() {
    super();
    this.path = ElderWoman2;
    this.texture = OrangeTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 0.5,
    modelPath = this.path,
    npcName = "Sorin the Wise",
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
