import {
  fetchNpcQuestDialog,
  updateQuestDataStatus,
  executeJavaCode,
  viewQuestById,
  updatePlayerQuestProgress,
  insertPlayerQuestProgress,
  fetchPlayerQuests,
  fetchQuestByQuestId,
  updateNpcQuestDialogById,
  fetchNpcByQuestId,
} from "./HandleTable";

class ManageQuest {
  constructor() {
    this.quests = {};
    this.status = {
      inactive: "inactive",
      active: "active",
      toComplete: "toComplete",
      completed: "completed",
    };
    this.type = {
      side: "side",
      sub: "sub",
      story: "story",
    };
  }

  fetchQuest() {
    fetchNpcQuestDialog();
  }

  async getQuestDataById(quest_id) {
    return await viewQuestById(quest_id);
  }

  submitPlayerAnswer(quest_title, answer) {
    console.log("submitted player answer: ", answer);
    console.log(quest_title);

    const data = { code: answer, quest: quest_title };
    executeJavaCode(data);
  }

  readQuest(title) {
    return this.quests[title];
  }

  getPlayerQuests() {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    return fetchPlayerQuests(player_id);
  }

  getQuestByQuestId(quest_id) {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    return fetchQuestByQuestId(player_id, quest_id);
  }

  insertQuestProgress(quest_id, quest_status) {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    insertPlayerQuestProgress(player_id, quest_id, quest_status);
  }

  updateQuestStatus(quest_id, newStatus) {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    updatePlayerQuestProgress(player_id, quest_id, newStatus);
  }

  acceptQuest(quest_id) {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    this.insertQuestProgress(quest_id, "active");
  }

  toCompleteQuest(quest_id) {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    updatePlayerQuestProgress(player_id, quest_id, this.status.toComplete);
  }

  completedQuest(npc_id, quest_id, dialog_id) {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    updatePlayerQuestProgress(player_id, quest_id, this.status.completed);
    updateNpcQuestDialogById(npc_id, null, null);
  }

  abandonQuest(quest_id) {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    updatePlayerQuestProgress(player_id, quest_id, this.status.inactive);
  }
}

export default ManageQuest;
