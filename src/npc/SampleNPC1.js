import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Quests from "../db/quests";

export default class SampleNPC1 extends NPCLoader {
  constructor(scene) {
    super(scene);
    this.path = "/src/assets/models/animations/";
    this.quests = new Quests();
  }
  initialize(
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    rotation = new THREE.Vector3(0, 0, 0),
    modelPath = this.path,
    npcName = "SampleNPC1",
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
        "Hello kid! I have a programming problem for you to solve.",
        "What I want you to do is what every programmers did to start their path.",
        'Using this line of code "System.out.println()", how would you output the word "Hello World"? ',
      ],
      "Hello World!",
      true,
      this.quests.type.side
    );
  }
}
