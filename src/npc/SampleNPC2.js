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
    this.createDialogBox(
      [
        "Hey! Do you know what are the variables? By variables, i mean, the containers that stores data values.",
        "If you know what I am talking about, this is easy for you!",
        'How would you store a string "Hello" in a variable? ',
      ],
      "Variables",
      true
    );
    // this.createDialogBox(["1", "2", "3"], "Variables", true);
  }
}
