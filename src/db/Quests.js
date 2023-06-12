// Separate script acting as a temporary placeholder for a database
class Quests {
  constructor() {
    this.quests = {};
    this.status = {
      inactive: "inactive",
      active: "active",
      completed: "completed",
    };
  }

  fetchQuest() {
    fetch("http://localhost:3000/quests")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Assuming the response is an array of quest objects
        // Update the UI with the retrieved data
        // ...
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  createQuest(title, description, status, from) {
    this.quests[title] = {
      title: title,
      description: description,
      status: status,
      from: from,
    };
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
