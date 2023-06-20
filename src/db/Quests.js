import {
  addQuestToTable,
  fetchQuestTable,
  fetchDialogTable,
  fetchNpcTable,
  fetchNpcQuestDialog,
  updateQuestDataStatus,
  fetchQuestById,
  viewQuestData,
  executeJavaCode,
} from "./HandleTable";

// Separate script acting as a temporary placeholder for a database
class Quests {
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

  updateQuestStatus(title, newStatus) {
    if (this.quests.hasOwnProperty(title)) {
      this.quests[title].status = newStatus;
    }
    updateQuestDataStatus(title, newStatus);
  }

  deleteQuest(title) {
    if (this.quests.hasOwnProperty(title)) {
      delete this.quests[title];
    }
  }
}

export default Quests;

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
