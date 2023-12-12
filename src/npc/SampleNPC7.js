import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import worker1 from "src/assets/npc/worker1/Idle.fbx";
import PurpleTexture from "src/assets/npc/worker1/Peasant Bryon Purple.png";

export default class SampleNPC7 extends NPCLoader {
  constructor() {
    super();
    this.path = worker1;
    this.texture = PurpleTexture;
  }
  initialize(
    scene,
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    groundMesh,
    rotation = 1,
    modelPath = this.path,
    npcName = "Village Farmer",
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
