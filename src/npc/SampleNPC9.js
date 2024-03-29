import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import ElderWoman1 from "src/assets/npc/ElderWoman1/Idle.fbx";
import PurpleTexture from "src/assets/npc/ElderWoman1/Peasant Elder Grenda Purple.png";

export default class SampleNPC9 extends NPCLoader {
  constructor() {
    super();
    this.path = ElderWoman1;
    this.texture = PurpleTexture;
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
    npcName = "Village Historian",
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
