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
    console.log("Fetching quests of Player id: ", player_id);
    return fetchPlayerQuests(player_id);
  }

  getQuestByQuestId(quest_id) {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    console.log("Fetching quests of Player id: ", player_id);
    return fetchQuestByQuestId(player_id, quest_id);
  }

  insertQuestProgress(quest_id) {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    console.log("Inserting quest progress of Player id: ", player_id);
    insertPlayerQuestProgress(player_id, quest_id);
  }

  updateQuestStatus(quest_id, newStatus) {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    console.log("Updating quest status of Player id: ", player_id);
    // updateQuestDataStatus(quest_id, newStatus);
    updatePlayerQuestProgress(player_id, quest_id, newStatus);
  }

  acceptQuest(quest_id) {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    console.log("Updating quest status of Player id: ", player_id);
    // updateQuestDataStatus(quest_id, this.status.active);
    this.insertQuestProgress(quest_id);
  }

  toCompleteQuest(quest_id) {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    console.log("Updating quest status of Player id: ", player_id);
    // updateQuestDataStatus(quest_id, this.status.toComplete);
    updatePlayerQuestProgress(player_id, quest_id, this.status.toComplete);
  }

  completedQuest(npc_id, quest_id, dialog_id) {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    console.log("Updating quest status of Player id: ", player_id);
    // updateQuestDataStatus(quest_id, this.status.completed);
    updatePlayerQuestProgress(player_id, quest_id, this.status.completed);
    updateNpcQuestDialogById(npc_id, null, null);
  }

  abandonQuest(quest_id) {
    const player_id = JSON.parse(localStorage.getItem("playerId"));
    console.log("Updating quest status of Player id: ", player_id);
    // updateQuestDataStatus(quest_id, this.status.inactive);
    updatePlayerQuestProgress(player_id, quest_id, this.status.inactive);
  }
}

export default ManageQuest;
