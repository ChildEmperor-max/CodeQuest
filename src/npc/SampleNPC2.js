import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Quests from "../db/quests";
import { fetchNpcDataByName } from "../db/HandleTable";

export default class SampleNPC2 extends NPCLoader {
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
    rotation = new THREE.Vector3(200, 0, 0),
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

    const viewNpcData = async () => {
      try {
        const npcData = await fetchNpcDataByName(npcName);
        console.log(npcData);
      } catch (error) {
        console.error("[ERROR]:", error);
      }
    };

    viewNpcData();
    this.createDialogBox(
      [
        "Hey! Do you know what are the variables? By variables, i mean, the containers that stores data values.",
        "If you know what I am talking about, this is easy for you!",
        'How would you store a string "Hello" in a variable? ',
      ],
      "Variables",
      true,
      this.quests.type.side
    );
  }
}
