import * as THREE from "three";
import NPCLoader from "./NPCLoader";
import Quests from "../db/quests";
import { viewNpcData, viewDialogData, viewQuestData } from "../db/HandleTable";

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
    async function fetchData(npcName) {
      try {
        const npcData = await viewNpcData(npcName);

        const dialogData = await viewDialogData(npcData[0].dialog_id);
        const dialogString = dialogData[0].dialog;
        const dialogWithoutBrackets = dialogString.slice(1, -1);
        const dialogArray = dialogWithoutBrackets
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map((item) => item.trim());

        var npcDialog = dialogArray;
        var npcHasQuest = false;
        var questTitle = null;
        var questType = null;
        var codeTemplate = null;
        var questAnswer = null;

        if (npcData[0].quest_id !== null) {
          const questData = await viewQuestData(npcData[0].quest_id);

          npcHasQuest = true;
          questTitle = questData[0].quest_title;
          questType = questData[0].quest_type;
          codeTemplate = questData[0].code_template;
          questAnswer = questData[0].quest_answer;
        }

        return {
          npcDialog,
          npcHasQuest,
          questTitle,
          questType,
          codeTemplate,
          questAnswer,
        };
      } catch (error) {
        console.error("[ERROR]:", error);
      }
    }

    const handleData = async (npcName) => {
      try {
        const {
          npcDialog,
          npcHasQuest,
          questTitle,
          questType,
          codeTemplate,
          questAnswer,
        } = await fetchData(npcName);
        this.createDialogBox(
          npcDialog,
          questTitle,
          npcHasQuest,
          questType,
          codeTemplate,
          questAnswer
        );
      } catch (error) {
        console.error("[ERROR]:", error);
      }
    };

    handleData.call(this, npcName);
  }
}
