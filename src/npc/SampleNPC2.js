import * as THREE from "three";
import NPCLoader from "./NPCLoader";

export default class SampleNPC2 extends NPCLoader {
  constructor(scene) {
    super(scene);
    this.path = "/src/assets/models/animations/";
  }
  initialize(
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    rotation = Math.PI / 2,
    modelPath = this.path,
    npcName = "SampleNPC2",
    scale = 0.01
  ) {
    super.initialize(
      position,
      camera,
      player,
      canvas,
      rotation,
      modelPath,
      npcName,
      scale
    );
    this.createDialogBox(["alo", "hello", "Do a flip!"], true);
  }
}
