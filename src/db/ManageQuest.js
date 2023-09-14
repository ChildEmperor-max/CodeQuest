import {
  fetchNpcQuestDialog,
  updateQuestDataStatus,
  executeJavaCode,
  viewQuestById,
} from "./HandleTable";

// Separate script acting as a temporary placeholder for a database
class ManageQuest {
  constructor() {
    this.quests = {};
    this.status = {
      inactive: "inactive",
      active: "active",
      completed: "completed",
    };
    this.type = {
      side: "side",
      story: "story",
    };
  }

  fetchQuest() {
    fetchNpcQuestDialog();
  }

  async getQuestDataById(quest_id) {
    return await viewQuestById(quest_id);
  }

  createQuest(title, description, status, from, type) {
    this.quests[title] = {
      title: title,
      description: description,
      status: status,
      from: from,
      type: type,
    };
    // addQuestToTable(from, title, description, status, type);
  }

  submitPlayerAnswer(quest_title, answer) {
    console.log("submitted player answer: ", answer);
    console.log(quest_title);
    // viewQuestData(quest);

    const code = answer; // Get the Java code from the Ace Editor
    const data = { code: code, quest: quest_title };
    executeJavaCode(data);
  }

  readQuest(title) {
    return this.quests[title];
  }

  updateQuest(title, updatedData) {
    if (this.quests.hasOwnProperty(title)) {
      this.quests[title] = { ...this.quests[title], ...updatedData };
    }
  }

  updateQuestStatus(quest_id, newStatus) {
    // if (this.quests.hasOwnProperty(title)) {
    //   this.quests[title].status = newStatus;
    // }
    updateQuestDataStatus(quest_id, newStatus);
  }

  acceptQuest(quest_id) {
    updateQuestDataStatus(quest_id, this.status.active);
  }

  abandonQuest(quest_id) {
    updateQuestDataStatus(quest_id, this.status.inactive);
  }

  deleteQuest(title) {
    if (this.quests.hasOwnProperty(title)) {
      delete this.quests[title];
    }
  }
}

export default ManageQuest;

// Usage example
// const questManager = new QuestManager();

//questManager.createQuest("Quest 1", "Description for Quest 1", questManager.status.inactive);
// console.log(questManager.quests["Quest 1"].status); // Output: "inactive"

// questManager.createQuest("Quest 1", "Description for Quest 1", "inactive");
// console.log(questManager.readQuest("Quest 1")); // Output: { title: "Quest 1", description: "Description for Quest 1", status: "inactive" }

// questManager.updateQuest("Quest 1", { status: "completed" });
// console.log(questManager.readQuest("Quest 1")); // Output: { title: "Quest 1", description: "Description for Quest 1", status: "completed" }

// questManager.deleteQuest("Quest 1");
// console.log(questManager.readQuest("Quest 1")); // Output: undefined
